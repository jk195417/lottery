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
  </div>
</template>

<script>
export default {
  data: () => ({
    config: window.lottery.config
  })
}
</script>

<style lang="css">
</style>
