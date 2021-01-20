export const state = () => ({
  filters: [
    { id: 0, name: 'по цене' },
    { id: 1, name: 'по популярности' },
  ],
  selected: 0,
})

export const mutations = {
  setFilter(state, filter) {
    state.selected = filter
  },
}

export const actions = {
  filter({ commit }, data) {
    commit('setFilter', data)
  },
}

export const getters = {
  filters: (s) => s.filters,
  current: (s) => s.selected,
}
