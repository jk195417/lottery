<template lang="html">
  <div class="d-flex" v-cloak="v-cloak">
    <div class="sidebar bg-dark" id="setting-panel" v-show="showSettingPanel">
      <setting-panel></setting-panel>
    </div>
    <div class="main w-100">
      <button type="button" class="btn btn-outline-dark m-2 float-left" v-on:click="toggleSettingPanel"><i class="fas fa-cogs" style="font-size: 2rem;"></i></button>
      <button type="button" class="btn btn-outline-dark m-2 float-right" v-on:click="toggleGiftPanel"><i class="fas fa-gift" style="font-size: 2rem;"></i></button>
      <lottery></lottery>
    </div>
    <div class="sidebar bg-dark" id="gift-panel" v-show="showGiftPanel">
      <gift-panel></gift-panel>
    </div>
  </div>
</template>

<style lang="scss">
$sidebar-width: 280px;
$sidebar-padding-top: 30px;
$main-width: $sidebar-width + 120px;

.sidebar {
  min-width: $sidebar-width;
  min-height: 100vh;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: $sidebar-padding-top;
}

.main {
  min-width: $main-width;
}
</style>

<script>
import lottery from './components/lottery.vue'
import settingPanel from './components/setting_panel.vue'
import giftPanel from './components/gift_panel.vue'

// global references, for managing state
window.lottery = {
  gifts: [],
  config: {
    min: 1,
    max: 100,
    msOfDrawing: 800, // 800ms
    msOfNoticing: 1000 // 1000ms
  },
  selectedGift: {
    index: null
  }
}

export default {
  components: {
    'setting-panel': settingPanel,
    'gift-panel': giftPanel,
    'lottery': lottery
  },
  data: () => ({
    showSettingPanel: true,
    showGiftPanel: true
  }),
  methods: {
    toggleSettingPanel: function () {
      this.showSettingPanel = !this.showSettingPanel
    },
    toggleGiftPanel: function () {
      this.showGiftPanel = !this.showGiftPanel
    }
  }
}
</script>
