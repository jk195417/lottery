<template>
  <div class="d-flex" v-cloak="v-cloak">
    <div id="sidebar">
      <setting-panel></setting-panel>
    </div>
    <div class="w-100">
      <lottery></lottery>
    </div>
  </div>
</template>

<script>
import lottery from './components/lottery.vue';
import settingPanel from './components/setting_panel.vue';
export default {
  data: () => ({
    min: 1,
    max: 100,
    msOfDrawing: 800, // 800ms
    msOfnoticing: 1000, // 1000ms
    winners: [],
    gifts: []
  })
  components: {
    'setting-panel': settingPanel,
    'lottery': lottery
  }
}
</script>
