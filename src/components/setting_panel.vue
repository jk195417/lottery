<template lang="html">
  <div class="container text-white">
    <h1 class="text-center">設定面板</h1>
    <form class="mt-5">
      <div class="form-group row">
        <label class="col col-form-label">最小號碼</label>
        <div class="col">
          <input type="text" class="form-control" v-model.number="config.min">
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">最大號碼</label>
        <div class="col">
          <input type="text" class="form-control" v-model.number="config.max">
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">抽獎時長(ms)</label>
        <div class="col">
          <input type="text" class="form-control" v-model.number="config.msOfDrawing">
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">通知時長(ms)</label>
        <div class="col">
          <input type="text" class="form-control" v-model.number="config.msOfNoticing">
        </div>
      </div>
    </form>
    <h1 class="text-center mt-5">紀錄</h1>
    <div>
      <div class="btn btn-block btn-secondary" v-on:click="importJson">
        匯入
      </div>
      <input id="import-lottery" v-on:change="processJson" type="file" hidden>
      <div class="btn btn-block btn-secondary mt-2" v-on:click="exportJson">
        匯出
      </div>
      <a id="export-lottery" download="lottery.json" hidden></a>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data: () => ({
    config: window.lottery.config
  }),
  methods: {
    ...mapMutations(['m_addGift']),
    importJson: function () {
      document.getElementById('import-lottery').click()
    },
    exportJson: function () {
      this.generateJson()
      document.getElementById('export-lottery').click()
    },
    generateJson: function () {
      let lottoeryData = window.lottery
      lottoeryData.gifts = this.$store.state.Gifts
      let download = document.getElementById('export-lottery')
      let encodedJson= encodeURIComponent(JSON.stringify(lottoeryData))
      let data = `data:text/json;charset=utf-8,${encodedJson}`
      download.href = data
    },
    processJson: function () {
      let file = document.getElementById('import-lottery').files[0]
      if (!(file)) return false;
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onloadend = (e) => {
        let import_data = JSON.parse(e.target.result)
        for (let key in import_data.config) {
          window.lottery.config[key] = import_data.config[key]
        }
        for (let gift of import_data.gifts) {
          this.m_addGift(gift)
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
