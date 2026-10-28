<script setup lang="ts">
import { computed } from 'vue'
import type { SaveData } from '../lottery'

const props = defineProps<{ save: SaveData; readonly?: boolean }>()
defineEmits<{ toggle: [serial: number] }>()

const sections = computed(() =>
  props.save.gifts.map((gift) => ({ gift, winners: props.save.winners.filter((w) => w.giftId === gift.id) })),
)
const total = computed(() => props.save.gifts.reduce((sum, g) => sum + g.number, 0))
</script>

<template>
  <section class="lt-card p-3 p-md-4 h-100" aria-label="中獎名單">
    <header class="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
      <h2 class="h3 mb-0">中獎名單</h2>
      <p class="mb-0 lt-muted">
        <strong class="fs-4">{{ save.winners.length }}</strong> / {{ total }} 份已抽出
      </p>
    </header>
    <slot name="actions" />

    <p v-if="sections.length === 0" class="lt-muted mb-0">還沒有禮物</p>
    <div v-for="{ gift, winners } in sections" :key="gift.id" class="gift-section">
      <div class="d-flex align-items-center gap-2">
        <img v-if="gift.imageUrl" :src="gift.imageUrl" :alt="gift.name" class="gift-image" @error="($event.target as HTMLImageElement).hidden = true" />
        <h3 class="h5 mb-0 flex-grow-1">{{ gift.name }}</h3>
        <span class="lt-muted small">{{ winners.length }} / {{ gift.number }}</span>
      </div>
      <div class="d-flex flex-wrap gap-2 mt-2">
        <template v-for="winner in winners" :key="winner.serial">
          <span v-if="readonly" class="ticket" :class="{ collected: winner.appearedAt }" :title="winner.appearedAt ? '已領獎' : undefined">
            {{ winner.serial }} 號
          </span>
          <button
            v-else
            type="button"
            class="ticket"
            :class="{ collected: winner.appearedAt }"
            :aria-pressed="!!winner.appearedAt"
            :title="winner.appearedAt ? '已領獎，點一下取消' : '點一下標記已領獎'"
            @click="$emit('toggle', winner.serial)"
          >
            {{ winner.serial }} 號
          </button>
        </template>
        <span v-if="winners.length === 0" class="lt-muted small">還沒抽</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gift-section {
  padding: 0.75rem 0;
  border-top: 1px solid var(--lt-divider);
}
.gift-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.5rem;
}
.ticket {
  padding: 0.2rem 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--lt-text);
  background: rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 0.5rem;
}
.ticket.collected {
  color: var(--lt-muted);
  text-decoration: line-through;
  background: transparent;
  border-color: rgb(255 255 255 / 10%);
}
</style>
