<script setup lang="ts">
import type { SaveData } from '../lottery'
import WinnerBoard from './WinnerBoard.vue'

defineProps<{ save: SaveData }>()
defineEmits<{ close: []; load: [] }>()
</script>

<template>
  <main class="container py-4">
    <div class="lt-card d-flex flex-wrap align-items-center gap-2 p-3 mb-3" role="note">
      <span class="me-auto">這是別人分享的抽獎結果（唯讀），不會影響你自己的抽獎。</span>
      <button type="button" class="btn btn-sm btn-outline-light" @click="$emit('load')">載入到我的抽獎</button>
      <button type="button" class="btn btn-sm btn-warning" @click="$emit('close')">回到我的抽獎</button>
    </div>
    <WinnerBoard :save="save" readonly />
  </main>
</template>
