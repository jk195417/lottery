<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { SaveData } from './lottery'
import { SHARE_PREFIX, decodeShare } from './share'
import { useLotteryStore } from './store'
import LotteryDraw from './components/LotteryDraw.vue'
import SettingPanel from './components/SettingPanel.vue'
import GiftPanel from './components/GiftPanel.vue'
import SharedResults from './components/SharedResults.vue'

const store = useLotteryStore()
const showSettingPanel = ref(true)
const showGiftPanel = ref(true)
const shared = ref<SaveData | null>(null)
const shareError = ref<string | null>(null)

async function readHash() {
  shareError.value = null
  if (!location.hash.startsWith(SHARE_PREFIX)) {
    shared.value = null
    return
  }
  try {
    shared.value = await decodeShare(location.hash.slice(SHARE_PREFIX.length))
  } catch (error) {
    shared.value = null
    shareError.value = `無法開啟分享連結：${(error as Error).message}`
  }
}

function closeShared() {
  // Drop the fragment without adding a history entry
  history.replaceState(null, '', location.pathname + location.search)
  shared.value = null
}

function loadShared() {
  if (!shared.value) return
  if (store.gifts.length && !confirm('分享的結果會取代你目前的禮物與中獎紀錄，確定嗎？')) return
  store.load(shared.value)
  closeShared()
}

onMounted(() => {
  readHash()
  window.addEventListener('hashchange', readHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', readHash))
</script>

<template>
  <SharedResults v-if="shared" :save="shared" @close="closeShared" @load="loadShared" />
  <div v-else class="d-lg-flex">
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
      <div v-if="shareError" class="alert alert-danger mx-3" role="alert">{{ shareError }}</div>
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
