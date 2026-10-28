<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { SaveData } from './lottery'
import { SHARE_PREFIX, decodeShare } from './share'
import { useLotteryStore } from './store'
import AppDrawer from './components/AppDrawer.vue'
import DrawStage from './components/DrawStage.vue'
import GiftManager from './components/GiftManager.vue'
import SettingPanel from './components/SettingPanel.vue'
import ShareButtons from './components/ShareButtons.vue'
import SharedResults from './components/SharedResults.vue'
import WinnerBoard from './components/WinnerBoard.vue'

const store = useLotteryStore()
// Start with the gift drawer open when there is nothing to draw yet
const showGifts = ref(store.gifts.length === 0)
const showSettings = ref(false)
const fullscreen = ref(false)
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

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen?.()
}
const onFullscreenChange = () => (fullscreen.value = !!document.fullscreenElement)

onMounted(() => {
  readHash()
  window.addEventListener('hashchange', readHash)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', readHash)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <div class="app">
  <SharedResults v-if="shared" :save="shared" @close="closeShared" @load="loadShared" />
  <template v-else>
    <header class="container-fluid d-flex align-items-center gap-2 py-3 px-3 px-lg-4">
      <h1 class="h3 mb-0 me-auto title"><i class="fas fa-tree me-2" aria-hidden="true"></i>抽獎時間</h1>
      <button type="button" class="btn btn-outline-light" :aria-expanded="showGifts" aria-controls="gift-drawer" @click="showGifts = true">
        <i class="fas fa-gift" aria-hidden="true"></i><span class="d-none d-sm-inline ms-2">禮物</span>
      </button>
      <button type="button" class="btn btn-outline-light" :aria-expanded="showSettings" aria-controls="setting-drawer" @click="showSettings = true">
        <i class="fas fa-gear" aria-hidden="true"></i><span class="d-none d-sm-inline ms-2">設定</span>
      </button>
      <button type="button" class="btn btn-outline-light" :aria-label="fullscreen ? '離開全螢幕' : '全螢幕'" @click="toggleFullscreen">
        <i class="fas" :class="fullscreen ? 'fa-compress' : 'fa-expand'" aria-hidden="true"></i>
      </button>
    </header>

    <main class="container-fluid px-3 px-lg-4 pb-4">
      <div v-if="shareError" class="alert alert-danger" role="alert">{{ shareError }}</div>
      <div class="row g-3 g-lg-4 stage-row">
        <div class="col-lg-8">
          <DrawStage />
        </div>
        <div class="col-lg-4">
          <WinnerBoard :save="store.$state" @toggle="store.toggleAppeared">
            <template #actions><ShareButtons /></template>
          </WinnerBoard>
        </div>
      </div>
    </main>

    <AppDrawer id="gift-drawer" v-model="showGifts" title="禮物" side="end">
      <GiftManager />
    </AppDrawer>
    <AppDrawer id="setting-drawer" v-model="showSettings" title="設定" side="end">
      <SettingPanel />
    </AppDrawer>
  </template>
  </div>
</template>

<style scoped>
.title i {
  color: var(--lt-gold);
}
.title {
  letter-spacing: 0.05em;
}

/* Fill the screen on a projector: the stage and the board stretch to the bottom */
@media (min-width: 992px) {
  .stage-row {
    min-height: calc(100vh - 6rem);
  }
}
</style>
