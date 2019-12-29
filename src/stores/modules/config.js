export default {
  namespaced: true,
  state: {
    config: {
      min: 1,
      max: 100,
      msOfDrawing: 800, // 800ms
      msOfNoticing: 1000 // 1000ms
    }
  },
  mutations: {
    load: (state, { config }) => {
      state.config = config
    },
    update: (state, { config }) => {
      state.config = { ...state.config, ...config }
    }
  },
  actions: {},
  getters: {
    poolSize: state => state.config.max - state.config.min + 1,
    pool: (state, getters) =>
      Array.from({ length: getters.poolSize }, (_, k) => k + state.config.min)
  }
}
