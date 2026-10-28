<script setup lang="ts">
import { computed, ref } from 'vue'
import { availableNumbers, drawProblem, pickRandom } from '../lottery'
import { useLotteryStore } from '../store'
import GiftRow from './GiftRow.vue'
import ShareButtons from './ShareButtons.vue'

const store = useLotteryStore()
const serial = ref<number | null>(null)
const drawing = ref(false)
const noticing = ref(false)
const problem = ref<string | null>(null)

const selectedGift = computed(() => store.gifts.find((g) => g.id === store.selectedGiftId))

function draw() {
  if (drawing.value) return
  problem.value = drawProblem(store.$state)
  if (problem.value) {
    // Hide the previous number so the reason is visible
    serial.value = null
    return
  }

  drawing.value = true
  setTimeout(() => {
    const gift = selectedGift.value
    drawing.value = false
    // Check again: settings or gifts may have changed while the cart was swinging
    problem.value = drawProblem(store.$state)
    if (problem.value || !gift) return

    serial.value = pickRandom(availableNumbers(store.config, store.winners))
    store.addWinner(serial.value, gift.id)
    noticing.value = true
    setTimeout(() => (noticing.value = false), store.config.msOfNoticing)
  }, store.config.msOfDrawing)
}
</script>

<template>
  <div class="container">
    <div class="notice-frame mt-5" aria-live="polite">
      <div
        v-if="serial !== null"
        class="alert alert-info text-center position-relative"
        :class="{ 'animate__animated animate__tada': noticing }"
        data-testid="result"
      >
        抽中了 <strong class="display-2 text-warning">{{ serial }}</strong> 號
        <button type="button" class="btn-close position-absolute top-0 end-0 m-3" aria-label="關閉" @click="serial = null"></button>
      </div>
      <div v-else-if="problem" class="alert alert-warning text-center" role="alert">{{ problem }}</div>
    </div>

    <div class="text-center">
      <button
        type="button"
        class="santa-cart"
        :class="{ 'animate__animated animate__swing': drawing }"
        :disabled="drawing"
        :aria-label="selectedGift ? `抽「${selectedGift.name}」` : '抽獎'"
        @click="draw"
      ></button>
      <p v-if="selectedGift" class="text-muted">點聖誕老人抽「{{ selectedGift.name }}」</p>
    </div>

    <div class="d-flex justify-content-between align-items-end">
      <p class="small mb-2">
        總共有 <strong class="text-warning h1">{{ store.giftTotal }}</strong> 份禮物
      </p>
      <h1>中獎名單</h1>
      <p class="small mb-2">
        總計已抽出 <strong class="text-warning h1">{{ store.winnerCount }}</strong> 位
      </p>
    </div>
    <ShareButtons />
    <table class="table align-middle">
      <thead>
        <tr>
          <th>名稱</th>
          <th>數量</th>
          <th>中獎號碼</th>
          <th><span class="visually-hidden">編輯</span></th>
        </tr>
      </thead>
      <tbody>
        <GiftRow v-for="gift in store.gifts" :key="gift.id" :gift="gift" />
      </tbody>
    </table>
    <p v-if="store.gifts.length === 0" class="text-center text-muted">先在右邊新增禮物，再點選禮物開始抽獎</p>
  </div>
</template>

<style scoped>
.notice-frame {
  min-height: 10rem;
  margin-bottom: 1rem;
}
.santa-cart {
  width: clamp(160px, 20vw, 280px);
  height: clamp(160px, 20vw, 280px);
  border: 0;
  background: url('../assets/images/xmas_santacart.png') center / contain no-repeat;
}
.santa-cart:disabled {
  opacity: 1;
}
</style>
