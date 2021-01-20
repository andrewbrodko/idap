export const state = () => ({
  items: [],
  opened: false,
  success: false,
})

export const mutations = {
  addItem(state, id) {
    state.items.push(id)
  },
  remItem(state, id) {
    state.items = state.items.filter((i) => i !== id)
  },
  setAll(state, data) {
    state.items = data
  },
  setCookies(state) {
    state.items.length
      ? this.$cookies.set('cart', state.items, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
      : this.$cookies.remove('cart', {
          path: '/',
        })
  },
  showCart(state, opened) {
    if (!opened) state.success = false
    state.opened = opened
  },
  order(state, data) {
    state.items = []
    state.success = true
  },
}

export const actions = {
  add({ commit }, id) {
    commit('addItem', id)
    commit('setCookies')
  },
  rem({ commit }, id) {
    commit('remItem', id)
    commit('setCookies')
  },
  set({ commit }, data) {
    commit('setAll', data)
  },
  show({ commit }, opened) {
    commit('showCart', opened)
  },
  order({ commit }, data) {
    commit('order', data)
    commit('setCookies')
  },
}

export const getters = {
  items: (s) => s.items,
  opened: (s) => s.opened,
  success: (s) => s.success,
}
