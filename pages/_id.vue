<template>
  <div :class="$style.container">
    <header>
      <p>{{ categories.find((c) => pageID === c.id).name }}</p>
      <span>
        <span class="icon-cart" @click="showCart()"></span>
        <i v-if="cart.count > 0">{{ cart.count }}</i>
      </span>
    </header>
    <p :class="$style.topLine">
      <span>Каталог</span>
      <span
        >Сортировать по:
        <span :class="$style.info">
          {{ filters.list.find((f) => filters.current === f.id).name }}
          <span class="icon-triangle-down"></span>
          <div :class="$style.select" hidden>
            <div>
              <p
                v-for="f of filters.list"
                :key="f.id"
                :class="filters.current === f.id ? $style.selected : ''"
                @click="setFlter(f.id)"
              >
                {{ f.name }}
              </p>
            </div>
          </div>
        </span>
      </span>
    </p>
    <section>
      <div :class="$style.navMenu">
        <p v-for="category of categories" :key="category.id">
          <a
            href="#"
            :class="pageID === category.id ? $style.selected : ''"
            @click.prevent="changeCategory(category.id)"
            >{{ category.name }}</a
          >
        </p>
      </div>

      <div :class="$style.productGrid">
        <div
          v-for="product of products"
          v-if="cart.list.filter((i) => i === product.id).length === 0"
          :key="product.id"
          :class="$style.item"
        >
          <p :class="$style.head">
            <span :class="$style.rating">
              <span class="icon-star"
                ><span
                  :class="$style.fill"
                  :style="{ height: `${(product.rating / 5) * 100}%` }"
                ></span
              ></span>
              &nbsp;{{ product.rating.toFixed(1) }}
            </span>
            <img
              :src="'https://frontend-test.idaproject.com' + product.photo"
            />
            <span :class="$style.actionAdd">
              <span class="icon-cart" @click="addToCart(product.id)"></span>
            </span>
          </p>
          <div :class="$style.rest">
            <p :class="$style.name">{{ product.name }}</p>
            <p :class="$style.price">
              {{
                new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(product.price)
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <div v-if="cart.opened" :class="$style.cart">
      <div :class="$style.tint" @click="showCart()"></div>
      <div :class="$style.content">
        <p :class="$style.head">
          <span>Корзина</span>
          <span class="icon-cross" @click="showCart()"></span>
        </p>
        <div :class="$style.rest">
          <div v-if="cart.success" :class="$style.cartSuccess">
            <img src="@/assets/ok.svg" />
            <p>Заявка успешно отправлена</p>
            <p>Вскоре наш менеджер свяжется с Вами</p>
          </div>
          <div v-else-if="cart.count === 0" :class="$style.cartBlank">
            <p>Пока что вы не добавили ничего в корзину</p>
            <div :class="$style.btn" @click="showCart()">Перейти к выбору</div>
          </div>
          <div v-else :class="$style.cartList">
            <p>Товары в корзине</p>
            <div v-for="item of cart.list" :key="item" :class="$style.item">
              <img
                :src="
                  'https://frontend-test.idaproject.com' +
                  allProducts.find((p) => p.id === item).photo
                "
              />
              <span>
                <p :class="$style.name">
                  {{ allProducts.find((p) => p.id === item).name }}
                </p>
                <p :class="$style.price">
                  {{
                    new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(allProducts.find((p) => p.id === item).price)
                  }}
                </p>
                <p :class="$style.rating">
                  <span class="icon-star"
                    ><span
                      :class="$style.fill"
                      :style="{
                        height: `${
                          (allProducts.find((p) => p.id === item).rating / 5) *
                          100
                        }%`,
                      }"
                    ></span
                  ></span>
                  &nbsp;{{
                    allProducts.find((p) => p.id === item).rating.toFixed(1)
                  }}
                </p>
              </span>
              <span :class="$style.actionRem" @click="removeFromCart(item)">
                <span class="icon-trash"></span>
              </span>
            </div>
            <p>Оформить заказ</p>
            <form v-on:submit.prevent="submitOrder">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                pattern="[A-Z][a-z]+|[А-Я][а-я]+"
                required
              />
              <input
                type="text"
                name="phone"
                v-mask="'+7 ### ###-##-##'"
                v-model="phoneModel"
                placeholder="Телефон"
                pattern="\+7 \d{3} \d{3}-\d{2}-\d{2}"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Адрес"
                pattern=".*\d$"
                required
              />
              <button type="submit" name="button">Отправить</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async validate({ store, params }) {
    if (store.getters['items/categories'].length === 0) {
      await store.dispatch('items/fetchCategories')
    }

    const categories = store.getters['items/categories']

    if (categories.length) {
      await store.dispatch('items/fetchAllProducts', categories)
    }

    return (
      /^\d+$/.test(params.id) &&
      categories.find((c) => c.id === Number(params.id))
    )
  },
  async asyncData({ store, params, app }) {
    await store.dispatch('items/fetchProducts', params.id)
    const cart = app.$cookies.get('cart')
    if (cart) await store.dispatch('cart/set', cart)
  },
  computed: {
    pageID() {
      return Number(this.$route.params.id)
    },
    categories() {
      return this.$store.getters['items/categories']
    },
    products() {
      return this.$store.getters['items/products']
        .map((p) => ({
          ...p,
          name: p.name.toLowerCase(),
        }))
        .sort((a, b) =>
          this.$store.getters['current'] === 0
            ? b.price - a.price
            : b.rating - a.rating
        )
    },
    allProducts() {
      return this.$store.getters['items/allProducts'].map((p) => ({
        ...p,
        name: p.name.toLowerCase(),
      }))
    },
    filters() {
      return {
        list: this.$store.getters['filters'],
        current: this.$store.getters['current'],
      }
    },
    cart() {
      return {
        list: this.$store.getters['cart/items'],
        count: this.$store.getters['cart/items'].length,
        opened: this.$store.getters['cart/opened'],
        success: this.$store.getters['cart/success'],
      }
    },
  },
  methods: {
    changeCategory(id) {
      this.$router.push(`${id}`)
    },
    setFlter(id) {
      this.$store.dispatch('filter', id)
    },
    showCart() {
      this.$store.dispatch('cart/show', !this.$store.getters['cart/opened'])
    },
    addToCart(id) {
      this.$store.dispatch('cart/add', id)
    },
    removeFromCart(id) {
      this.$store.dispatch('cart/rem', id)
    },
    submitOrder({ target: { elements } }) {
      const data = {
        name: elements.name.value,
        phone: elements.phone.value,
        address: elements.address.value,
      }
      console.log(data)
      this.$store.dispatch('cart/order', data)
    },
  },
  data: () => ({
    phoneModel: '',
  }),
}
</script>

<style module lang="scss">
$hheight: 66px;

.container {
  margin: auto;
  padding-top: $hheight;

  & > * {
    padding: 0 88px;
  }

  header {
    height: $hheight;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
    border-radius: 0px 0px 8px 8px;
    z-index: 20;

    p {
      font-family: 'PTSans';
      font-style: normal;
      font-weight: bold;
      font-size: 22px;
      line-height: 28px;
      color: #59606d;
    }

    span {
      position: relative;
      width: 34px;
      height: 33px;
      display: grid;
      place-items: center;

      & > span {
        font-size: 26.4px;
        cursor: pointer;
      }

      i {
        position: absolute;
        top: 0;
        right: 0;
        width: 12px;
        height: 12px;
        background: #959dad;
        border-radius: 50%;
        color: $white;
        display: grid;
        place-items: center;

        font-family: 'PTSans';
        font-style: normal;
        font-weight: bold;
        font-size: 8px;
        line-height: 10px;
      }
    }
  }

  .topLine {
    margin: 32px 0 24px 0;
    font-family: 'PTSans';
    font-style: normal;
    color: $black;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > span:first-of-type {
      font-weight: bold;
      font-size: 32px;
      line-height: 41px;
    }

    & > span:last-of-type {
      font-weight: normal;
      font-size: 16px;
      line-height: 21px;

      .info {
        font-style: normal;
        color: $grey;
        cursor: pointer;
        position: relative;

        & > span {
          font-size: 3px;
          vertical-align: middle;
        }

        &:hover > div.select {
          display: block;
        }

        .select {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          padding-top: 6px;
          padding: 8px 0;
          z-index: 20;
          width: 160px;

          & > div {
            margin-top: 6px;
            padding: 8px 0;
            background: $white;
            box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            z-index: 20;
            width: 100%;

            & > * {
              font-family: 'PTSans';
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 26px;
              padding: 0 12px;
              color: $grey-light;

              &:first-letter {
                text-transform: capitalize;
              }

              &.selected {
                color: $black;
              }

              &:hover {
                background: $grey-extra-light;
              }
            }
          }
        }
      }
    }
  }

  section {
    display: flex;

    .navMenu {
      width: 161px;

      p {
        margin: 16px 0;

        &:first-of-type {
          margin-top: 0;
        }

        &:last-of-type {
          margin-bottom: 0;
        }

        a {
          font-family: 'PTSans';
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 21px;
          color: $grey-light;
          text-decoration: none;

          &.selected {
            color: $black;
            text-decoration: underline;
          }

          &:hover {
            color: $grey;
            cursor: pointer;
          }
        }
      }
    }

    .productGrid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 16px;
      margin-bottom: 65px;

      .item {
        width: 264px;
        height: 272px;
        display: flex;
        flex-direction: column;
        padding: 16px;
        background: $white;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
        border-radius: 8px;

        .head,
        .rest {
          display: flex;
        }

        .head {
          position: relative;
          justify-content: center;

          .rating {
            position: absolute;
            display: flex;
            align-items: center;
            top: 0;
            left: 0;
            font-family: 'PTSans';
            font-style: normal;
            font-weight: bold;
            font-size: 10px;
            line-height: 13px;
            color: $yellow;

            & > span {
              font-size: 14px;
              position: relative;

              .fill {
                content: '';
                position: absolute;
                width: 100%;
                left: 0;
                bottom: 0;
                background: url('~assets/star-filled.svg') no-repeat bottom;
              }
            }
          }

          & > img {
            height: 180px;
            width: auto;
          }

          .actionAdd {
            position: absolute;
            top: 0;
            right: 0;

            & > span {
              font-size: 14px;
              color: $grey-light;

              &:hover {
                color: $black;
                cursor: pointer;
              }
            }
          }
        }

        .rest {
          flex-direction: column;

          & > * {
            font-family: 'PTSans';
            font-style: normal;
            font-size: 14px;
            line-height: 18px;
          }

          .name {
            font-weight: normal;
            color: $grey;
            text-transform: capitalize;
          }

          .price {
            font-weight: bold;
            color: $black;
          }
        }
      }
    }
  }

  .cart {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 100%;
    padding: 0;

    .tint {
      width: 100%;
      height: 100%;
      background: $white;
      opacity: 0.8;
    }

    .content {
      position: absolute;
      right: 0;
      top: 0;
      width: 460px;
      height: 100%;
      background: $white;
      box-shadow: -4px 0px 16px rgba(0, 0, 0, 0.05);
      border-radius: 8px 0px 0px 8px;
      padding: 52px 48px;
      display: flex;
      flex-direction: column;

      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        span:first-of-type {
          font-family: 'PTSans';
          font-style: normal;
          font-weight: bold;
          font-size: 32px;
          line-height: 41px;
        }

        span:last-of-type {
          font-size: 14px;
          height: 14px;
          cursor: pointer;
        }
      }

      .rest {
        display: flex;
        flex-direction: column;
        font-family: 'PTSans';
        font-style: normal;
        font-weight: normal;
        flex-grow: 1;
        height: 0;

        div > p {
          margin-bottom: 24px;
        }

        .cartSuccess {
          font-size: 22px;
          line-height: 28px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-grow: 1;

          p {
            margin: 1px;
            font-family: 'PTSans';
            font-style: normal;
            text-align: center;
          }

          p:first-of-type {
            font-weight: bold;
            font-size: 24px;
            line-height: 31px;
          }

          p:last-of-type {
            font-weight: normal;
            font-size: 16px;
            line-height: 21px;
            color: $grey;
          }
        }

        .cartBlank {
          font-size: 22px;
          line-height: 28px;

          .btn {
            height: 50px;
            background: $black;
            border-radius: 8px;
            color: $white;
            font-size: 16px;
            line-height: 21px;
            display: grid;
            place-items: center;
            cursor: pointer;
          }
        }

        .cartList {
          font-size: 18px;
          line-height: 23px;
          color: $grey;
          flex-grow: 1;
          height: 0;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;
          scrollbar-width: none;
          padding: 20px;
          margin: -20px;

          .item {
            background: $white;
            box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            height: 120px;
            margin-bottom: 12px;

            img {
              height: 90px;
              width: 71px;
              min-width: 71px;
              object-fit: cover;
              margin: 15px;
            }

            & > span:not(.action-rem) {
              margin: 15px 10px;
              display: flex;
              flex-direction: column;
              font-family: 'PTSans';
              font-style: normal;
              font-size: 14px;
              line-height: 18px;
              width: 100%;

              .name {
                text-transform: capitalize;
                font-weight: normal;
                color: $grey;
                margin-bottom: 6px;
              }

              .price {
                font-weight: bold;
                color: $black;
              }

              .rating {
                font-weight: bold;
                font-size: 10px;
                line-height: 13px;
                color: $yellow;
                margin-top: auto;
                display: flex;
                align-items: center;

                & > span {
                  font-size: 14px;
                  position: relative;

                  .fill {
                    content: '';
                    position: absolute;
                    width: 100%;
                    left: 0;
                    bottom: 0;
                    background: url('~assets/star-filled.svg') no-repeat bottom;
                  }
                }
              }
            }

            & > span.actionRem {
              min-width: 32px;
              width: 32px;
              margin: 16px;
              display: grid;
              place-items: center;
              font-size: 22px;
              color: $grey-light;
              cursor: pointer;

              &:hover {
                color: $black;
              }
            }
          }

          p:last-of-type {
            margin-top: 20px;
          }

          form {
            ::placeholder {
              color: $grey-light;
              opacity: 1;
            }

            & > * {
              height: 50px;
              width: 100%;
              font-family: 'PTSans';
              font-style: normal;
              font-weight: normal;
              font-size: 16px;
              line-height: 21px;
              border-width: 0px;
              border: none;

              &:focus {
                outline: none;
              }

              &:required,
              &:invalid {
                box-shadow: none;
              }

              &:invalid {
                ~ button {
                  background: $grey;
                  pointer-events: none;
                }
              }
            }

            input {
              color: $black;
              background: $grey-extra-light;
              border-radius: 8px;
              padding: 14px;
              margin-bottom: 30px;
            }

            button {
              background: $black;
              border-radius: 8px;
              color: $white;
              cursor: pointer;
            }
          }
        }

        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      }
    }
  }
}

.container,
header {
  max-width: 1440px;
  width: 100%;
}
</style>
