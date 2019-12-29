<template lang="html">
  <div
    v-cloak
    class="d-flex"
  >
    <div
      v-show="showSettingPanel"
      id="setting-panel"
      class="sidebar bg-dark"
    >
      <setting-panel />
    </div>
    <div class="main w-100">
      <button
        type="button"
        class="btn btn-outline-dark m-2 float-left"
        @click="toggleSettingPanel"
      >
        <i
          class="fas fa-cogs"
          style="font-size: 2rem;"
        />
      </button>
      <button
        type="button"
        class="btn btn-outline-dark m-2 float-right"
        @click="toggleGiftPanel"
      >
        <i
          class="fas fa-gift"
          style="font-size: 2rem;"
        />
      </button>
      <lottery />
    </div>
    <div
      v-show="showGiftPanel"
      id="gift-panel"
      class="sidebar bg-dark"
    >
      <gift-panel />
    </div>
  </div>
</template>

<script>
import lottery from './components/lottery'
import settingPanel from './components/setting-panel'
import giftPanel from './components/gift-panel'

export default {
  components: {
    'setting-panel': settingPanel,
    'gift-panel': giftPanel,
    lottery: lottery
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
