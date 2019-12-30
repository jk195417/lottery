export default {
  namespaced: true,
  state: { winners: [] },
  mutations: {
    load: (state, { winners }) => {
      state.winners = winners
    },
    add: (state, { winner }) => state.winners.push(winner),
    delete: (state, { serial }) => {
      const index = state.winners.findIndex(g => g.serial === serial)
      state.winners.splice(index, 1)
    },
    appear: (state, { serial }) => {
      const winner = state.winners.find(g => g.serial === serial)
      if (winner.appearedAt) {
        winner.appearedAt = null
      } else {
        winner.appearedAt = new Date().toISOString()
      }
    }
  },
  actions: {},
  getters: {
    find: state => serial => state.winners.find(w => w.serial === serial),
    findIndex: state => serial =>
      state.winners.findIndex(w => w.serial === serial),
    serials: state => state.winners.map(w => w.serial),
    disappear: state => state.winners.filter(w => !(w.appearedAt == null)),
    appeared: state => state.winners.filter(w => w.appearedAt == null),
    count: state => state.winners.length,
    belongsToGift: state => giftId =>
      state.winners.filter(w => w.giftId === giftId)
  }
}
