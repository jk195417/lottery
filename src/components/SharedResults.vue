<script setup lang="ts">
import { computed } from 'vue'
import type { SaveData } from '../lottery'

const props = defineProps<{ save: SaveData }>()
defineEmits<{ close: []; load: [] }>()

const rows = computed(() =>
  props.save.gifts.map((gift) => ({ gift, winners: props.save.winners.filter((w) => w.giftId === gift.id) })),
)
const total = computed(() => props.save.gifts.reduce((sum, g) => sum + g.number, 0))
</script>

<template>
  <main class="container py-4">
    <div class="alert alert-info d-flex flex-wrap align-items-center gap-2" role="note">
      <span class="me-auto">這是別人分享的抽獎結果（唯讀），不會影響你自己的抽獎。</span>
      <button type="button" class="btn btn-sm btn-outline-secondary" @click="$emit('load')">載入到我的抽獎</button>
      <button type="button" class="btn btn-sm btn-primary" @click="$emit('close')">回到我的抽獎</button>
    </div>
    <div class="d-flex justify-content-between align-items-end">
      <p class="small mb-2">
        總共有 <strong class="text-warning h1">{{ total }}</strong> 份禮物
      </p>
      <h1>中獎名單</h1>
      <p class="small mb-2">
        總計已抽出 <strong class="text-warning h1">{{ save.winners.length }}</strong> 位
      </p>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th>名稱</th>
          <th>數量</th>
          <th>中獎號碼</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ gift, winners } in rows" :key="gift.id">
          <td>
            {{ gift.name }}
            <img v-if="gift.imageUrl" :src="gift.imageUrl" :alt="gift.name" class="gift-image d-block mt-1" />
          </td>
          <td>已抽出 {{ winners.length }} / {{ gift.number }}</td>
          <td>
            <span
              v-for="winner in winners"
              :key="winner.serial"
              class="badge m-1 fs-6"
              :class="winner.appearedAt ? 'text-bg-secondary text-decoration-line-through' : 'text-bg-warning'"
              :title="winner.appearedAt ? '已領獎' : undefined"
            >
              {{ winner.serial }} 號
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.gift-image {
  max-width: 200px;
  max-height: 120px;
  object-fit: cover;
}
</style>
