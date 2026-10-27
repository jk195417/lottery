<script setup lang="ts">
import { ref } from 'vue'
import LotteryDraw from './components/LotteryDraw.vue'
import SettingPanel from './components/SettingPanel.vue'
import GiftPanel from './components/GiftPanel.vue'

const showSettingPanel = ref(true)
const showGiftPanel = ref(true)
</script>

<template>
  <div class="d-lg-flex">
    <aside v-show="showSettingPanel" id="setting-panel" class="sidebar bg-dark" aria-label="設定面板">
      <SettingPanel />
    </aside>
    <main class="main w-100">
      <div class="d-flex justify-content-between">
        <button
          type="button"
          class="btn btn-outline-dark m-2"
          aria-controls="setting-panel"
          :aria-expanded="showSettingPanel"
          aria-label="設定面板"
          @click="showSettingPanel = !showSettingPanel"
        >
          <i class="fas fa-cogs fs-2" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="btn btn-outline-dark m-2"
          aria-controls="gift-panel"
          :aria-expanded="showGiftPanel"
          aria-label="新增禮物"
          @click="showGiftPanel = !showGiftPanel"
        >
          <i class="fas fa-gift fs-2" aria-hidden="true"></i>
        </button>
      </div>
      <LotteryDraw />
    </main>
    <aside v-show="showGiftPanel" id="gift-panel" class="sidebar bg-dark" aria-label="新增禮物">
      <GiftPanel />
    </aside>
  </div>
</template>

<style>
.sidebar {
  padding: 30px 0;
}

@media (min-width: 992px) {
  .sidebar {
    flex: 0 0 280px;
    min-height: 100vh;
  }
}
</style>
