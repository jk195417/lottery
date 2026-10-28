<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { availableNumbers, drawProblem, pickRandom } from '../lottery'
import { useLotteryStore } from '../store'

const store = useLotteryStore()
const shown = ref<number | null>(null)
const drawing = ref(false)
const revealed = ref(false)
const problem = ref<string | null>(null)
let rollTimer: ReturnType<typeof setInterval> | undefined

const selectedGift = computed(() => store.gifts.find((g) => g.id === store.selectedGiftId))
const remaining = (giftId: number, number: number) => number - store.winnersOf(giftId).length
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// Skip the confetti when motion is reduced or the browser cannot draw on a canvas (tests)
const canDrawCanvas = () => !!document.createElement('canvas').getContext?.('2d')

async function celebrate() {
  if (reducedMotion() || !canDrawCanvas()) return
  try {
    const { default: confetti } = await import('canvas-confetti')
    const colors = ['#f5c451', '#e2463b', '#fff7e6', '#3fb37f']
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.45 }, colors })
    confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors })
    confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors })
  } catch {
    // No canvas (tests, very old browsers): skip the confetti
  }
}

function draw() {
  if (drawing.value) return
  problem.value = drawProblem(store.$state)
  if (problem.value) {
    shown.value = null
    revealed.value = false
    return
  }

  drawing.value = true
  revealed.value = false
  const pool = availableNumbers(store.config, store.winners)
  if (!reducedMotion()) rollTimer = setInterval(() => (shown.value = pickRandom(pool)), 70)

  setTimeout(() => {
    clearInterval(rollTimer)
    const gift = selectedGift.value
    drawing.value = false
    // Check again: settings or gifts may have changed while the numbers were rolling
    problem.value = drawProblem(store.$state)
    if (problem.value || !gift) {
      shown.value = null
      return
    }
    const serial = pickRandom(availableNumbers(store.config, store.winners))
    store.addWinner(serial, gift.id)
    shown.value = serial
    revealed.value = true
    celebrate()
  }, store.config.msOfDrawing)
}

// Space or Enter draws, so a presenter clicker works; ignored while typing in a form
function onKey(event: KeyboardEvent) {
  if (event.key !== ' ' && event.key !== 'Enter') return
  const target = event.target as HTMLElement
  if (target.closest('input, textarea, select, button, a, [contenteditable]')) return
  event.preventDefault()
  draw()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearInterval(rollTimer)
})
</script>

<template>
  <section class="lt-card stage p-3 p-md-4 h-100 d-flex flex-column" aria-label="抽獎">
    <div class="gift-picker" role="group" aria-label="選擇要抽的禮物">
      <button
        v-for="gift in store.gifts"
        :key="gift.id"
        type="button"
        class="gift-chip"
        :class="{ active: gift.id === store.selectedGiftId, empty: remaining(gift.id, gift.number) <= 0 }"
        :aria-pressed="gift.id === store.selectedGiftId"
        @click="store.selectGift(gift.id)"
      >
        <span class="name">{{ gift.name }}</span>
        <span class="left">剩 {{ remaining(gift.id, gift.number) }} 份</span>
      </button>
      <p v-if="store.gifts.length === 0" class="lt-muted mb-0">右上角「禮物」新增禮物後，就可以開始抽獎</p>
    </div>

    <div class="number-frame flex-grow-1 d-flex flex-column align-items-center justify-content-center my-3" aria-live="polite">
      <p class="gift-title mb-1" :class="{ invisible: !selectedGift }"><i class="fas fa-gift text-gold me-2" aria-hidden="true"></i>{{ selectedGift?.name ?? '—' }}</p>
      <div
        class="number"
        :class="{ rolling: drawing, revealed }"
        data-testid="result"
        :aria-label="revealed && shown !== null ? `抽中了 ${shown} 號` : undefined"
      >
        {{ shown ?? '?' }}
      </div>
      <p v-if="revealed && shown !== null" class="lt-muted mb-0 fs-5">抽中了 {{ shown }} 號！</p>
      <p v-else-if="problem" class="problem mb-0" role="alert">{{ problem }}</p>
      <p v-else class="lt-muted mb-0">號碼 {{ store.config.min }} ~ {{ store.config.max }}</p>
    </div>

    <div class="text-center">
      <button
        type="button"
        class="draw-button"
        :disabled="drawing"
        :aria-label="selectedGift ? `抽「${selectedGift.name}」` : '抽獎'"
        @click="draw"
      >
        <img src="../assets/images/xmas_santacart.png" alt="" class="cart" :class="{ swing: drawing }" />
        <span>{{ drawing ? '抽獎中…' : '抽獎' }}</span>
      </button>
      <p class="lt-muted small mt-2 mb-0">也可以按空白鍵或 Enter</p>
    </div>
  </section>
</template>

<style scoped>
.gift-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.gift-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem 1rem;
  color: var(--lt-text);
  background: rgb(255 255 255 / 5%);
  border: 1px solid var(--lt-card-border);
  border-radius: 0.75rem;
}
.gift-chip .name {
  font-size: 1.15rem;
}
.gift-chip .left {
  font-size: 0.8rem;
  color: var(--lt-muted);
}
.gift-chip.active {
  color: #2a1406;
  background: var(--lt-gold);
  border-color: var(--lt-gold-strong);
}
.gift-chip.active .left {
  color: rgb(42 20 6 / 75%);
}
.gift-chip.empty:not(.active) {
  opacity: 0.5;
}
.gift-title {
  font-size: clamp(1.25rem, 2.5vw, 2rem);
}
.number {
  font-size: clamp(6rem, min(22vw, 32vh), 22rem);
  font-weight: 700;
  line-height: 1;
  color: var(--lt-gold-strong);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 40px rgb(245 196 81 / 45%);
}
.number.rolling {
  opacity: 0.85;
  filter: blur(1px);
}
.number.revealed {
  animation: pop 0.6s cubic-bezier(0.2, 1.6, 0.4, 1);
}
.problem {
  color: #ffb4a8;
  font-size: 1.25rem;
}
.draw-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 2rem;
  font-weight: 700;
  color: #2a1406;
  background: linear-gradient(180deg, var(--lt-gold-strong), var(--lt-gold));
  border: 0;
  border-radius: 999px;
  box-shadow: 0 8px 30px rgb(245 196 81 / 35%);
}
.draw-button:disabled {
  opacity: 0.8;
}
.draw-button:focus-visible {
  outline: 4px solid var(--lt-text);
  outline-offset: 4px;
}
.cart {
  width: 72px;
  height: 72px;
}
.cart.swing {
  animation: swing 0.5s ease-in-out infinite alternate;
}
@keyframes pop {
  from {
    transform: scale(0.4);
  }
  to {
    transform: scale(1);
  }
}
@keyframes swing {
  from {
    transform: rotate(-12deg);
  }
  to {
    transform: rotate(12deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .number.revealed,
  .cart.swing {
    animation: none;
  }
}
</style>
