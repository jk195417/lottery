export default {
  namespaced: true,
  state: {
    gifts: [],
    selectedId: null
  },
  mutations: {
    load: (state, { gifts }) => {
      state.gifts = gifts
    },
    add: (state, { gift }) => state.gifts.push(gift),
    update: (state, { id, gift }) => {
      const index = state.gifts.findIndex(g => g.id === id)
      state.gifts[index] = { ...state.gifts[index], ...gift }
    },
    updateName: (state, { id, name }) => {
      state.gifts.find(g => g.id === id).name = name
    },
    updateNumber: (state, { id, number }) => {
      state.gifts.find(g => g.id === id).number = number
    },
    updateImageUrl: (state, { id, imageUrl }) => {
      state.gifts.find(g => g.id === id).imageUrl = imageUrl
    },
    delete: (state, { id }) => {
      const index = state.gifts.findIndex(g => g.id === id)
      state.gifts.splice(index, 1)
    },
    select: (state, { id }) => (state.selectedId = id)
  },
  actions: {},
  getters: {
    find: state => id => state.gifts.find(g => g.id === id),
    findIndex: state => id => state.gifts.findIndex(g => g.id === id),
    selected: state => state.gifts.find(g => g.id === state.selectedId),
    sum: state => state.gifts.reduce((total, gift) => total + gift.number, 0)
  }
}
