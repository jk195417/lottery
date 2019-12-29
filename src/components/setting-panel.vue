<template lang="html">
  <div class="container text-white">
    <h1 class="text-center">
      設定面板
    </h1>
    <form class="mt-5">
      <div class="form-group row">
        <label class="col col-form-label">最小號碼</label>
        <div class="col">
          <input
            v-model.number="min"
            type="text"
            class="form-control"
          >
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">最大號碼</label>
        <div class="col">
          <input
            v-model.number="max"
            type="text"
            class="form-control"
          >
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">抽獎時長(ms)</label>
        <div class="col">
          <input
            v-model.number="msOfDrawing"
            type="text"
            class="form-control"
          >
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">通知時長(ms)</label>
        <div class="col">
          <input
            v-model.number="msOfNoticing"
            type="text"
            class="form-control"
          >
        </div>
      </div>
    </form>
    <h1 class="text-center mt-5">
      紀錄
    </h1>
    <div>
      <div
        class="btn btn-block btn-secondary"
        @click="importJson"
      >
        匯入
      </div>
      <input
        id="import-lottery"
        type="file"
        hidden
        @change="processJson"
      >
      <div
        class="btn btn-block btn-secondary mt-2"
        @click="exportJson"
      >
        匯出
      </div>
      <a
        id="export-lottery"
        download="lottery.json"
        hidden
      />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    min: {
      get () {
        return this.$store.state.config.config.min
      },
      set (min) {
        this.$store.commit('config/update', { config: { min } })
      }
    },
    max: {
      get () {
        return this.$store.state.config.config.max
      },
      set (max) {
        this.$store.commit('config/update', { config: { max } })
      }
    },
    msOfDrawing: {
      get () {
        return this.$store.state.config.config.msOfDrawing
      },
      set (msOfDrawing) {
        this.$store.commit('config/update', { config: { msOfDrawing } })
      }
    },
    msOfNoticing: {
      get () {
        return this.$store.state.config.config.msOfNoticing
      },
      set (msOfNoticing) {
        this.$store.commit('config/update', { config: { msOfNoticing } })
      }
    }
  },
  methods: {
    importJson: function () {
      document.getElementById('import-lottery').click()
    },
    exportJson: function () {
      this.generateJson()
      document.getElementById('export-lottery').click()
    },
    generateJson: function () {
      let downloadLink = document.getElementById('export-lottery')
      let encodedJson = encodeURIComponent(JSON.stringify(this.$store.state))
      downloadLink.href = `data:text/json;charset=utf-8,${encodedJson}`
    },
    processJson: function () {
      let file = document.getElementById('import-lottery').files[0]
      if (!file) return false
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onloadend = e => {
        const importedState = JSON.parse(e.target.result)
        this.$store.commit('config/load', importedState.config)
        this.$store.commit('gifts/load', importedState.gifts)
        this.$store.commit('winners/load', importedState.winners)
      }
    }
  }
}
</script>
