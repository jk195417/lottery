<template>
  <div class="d-flex" v-cloak="v-cloak">
    <div class="sidebar bg-dark" id="setting-panel" v-show="showSettingPanel">
      <setting-panel></setting-panel>
    </div>
    <div class="w-100">
      <button type="button" class="btn btn-outline-dark m-2 float-left" v-on:click="toggleSettingPanel"><i class="fas fa-cogs" style="font-size: 2rem;"></i></button>
      <button type="button" class="btn btn-outline-dark m-2 float-right" v-on:click="toggleGiftPanel"><i class="fas fa-gift" style="font-size: 2rem;"></i></button>
      <lottery-panel></lottery-panel>
    </div>
    <div class="sidebar bg-dark" id="gift-panel" v-show="showGiftPanel">
      <gift-panel></gift-panel>
    </div>
  </div>
</template>

<script>
import lotteryPanel from './components/lottery_panel.vue';
import settingPanel from './components/setting_panel.vue';
import giftPanel from './components/gift_panel.vue';
export default {
  data: () => ({
    showSettingPanel: false,
    showGiftPanel: false
  }),
  components: {
    'setting-panel': settingPanel,
    'gift-panel': giftPanel,
    'lottery-panel': lotteryPanel
  },
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
