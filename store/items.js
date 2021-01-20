export const state = () => ({
  categories: [],
  products: [],
  allProducts: [],
})

export const mutations = {
  setCategories(state, categories) {
    state.categories = categories
  },
  setProducts(state, products) {
    state.products = products
  },
  setAllProducts(state, products) {
    state.allProducts = products.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    )
  },
}

export const actions = {
  async fetchCategories({ commit }) {
    const categories = await this.$axios.$get(
      'https://frontend-test.idaproject.com/api/product-category'
    )
    commit('setCategories', categories)
  },
  async fetchProducts({ commit }, id) {
    const products = await this.$axios.$get(
      `https://frontend-test.idaproject.com/api/product?category=${id}`
    )
    commit('setProducts', products)
  },
  async fetchAllProducts({ commit }, categories) {
    const products = await Promise.all(
      categories.map(
        async ({ id }) =>
          await this.$axios.$get(
            `https://frontend-test.idaproject.com/api/product?category=${id}`
          )
      )
    )
    commit(
      'setAllProducts',
      products.reduce((sum, i) => [...sum, ...i], [])
    )
  },
}

export const getters = {
  categories: (s) => s.categories,
  products: (s) => s.products,
  allProducts: (s) => s.allProducts,
}
