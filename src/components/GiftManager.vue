<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Gift } from '../lottery'
import { useLotteryStore } from '../store'

const store = useLotteryStore()
const blank = () => ({ name: '禮物', number: 1, imageUrl: '' })
const form = reactive(blank())
const editingId = ref<number | null>(null)
const draft = reactive(blank())

function add() {
  store.addGift({ name: form.name, number: form.number, imageUrl: form.imageUrl || null })
  Object.assign(form, blank())
}

function edit(gift: Gift) {
  Object.assign(draft, { name: gift.name, number: gift.number, imageUrl: gift.imageUrl ?? '' })
  editingId.value = gift.id
}

function save(id: number) {
  store.updateGift(id, { name: draft.name, number: draft.number, imageUrl: draft.imageUrl || null })
  editingId.value = null
}
</script>

<template>
  <form id="gift-form" class="mb-4" @submit.prevent="add">
    <div class="mb-2">
      <label class="form-label small mb-1" for="gift-name">禮物名稱</label>
      <input id="gift-name" v-model="form.name" class="form-control" placeholder="iPhone 17" required />
    </div>
    <div class="row g-2 mb-2">
      <div class="col-4">
        <label class="form-label small mb-1" for="gift-number">數量</label>
        <input id="gift-number" v-model.number="form.number" type="number" min="1" class="form-control" required />
      </div>
      <div class="col-8">
        <label class="form-label small mb-1" for="gift-image">照片連結（選填）</label>
        <input id="gift-image" v-model="form.imageUrl" type="url" class="form-control" placeholder="https://…" />
      </div>
    </div>
    <button type="submit" class="btn btn-warning w-100">新增禮物</button>
  </form>

  <h3 class="h6 lt-muted">已新增的禮物</h3>
  <p v-if="store.gifts.length === 0" class="lt-muted small">還沒有禮物</p>
  <ul class="list-unstyled mb-0">
    <li v-for="gift in store.gifts" :key="gift.id" class="gift-item">
      <form v-if="editingId === gift.id" @submit.prevent="save(gift.id)">
        <input v-model="draft.name" class="form-control form-control-sm mb-2" aria-label="禮物名稱" required />
        <div class="row g-2 mb-2">
          <div class="col-4">
            <input v-model.number="draft.number" type="number" min="1" class="form-control form-control-sm" aria-label="數量" required />
          </div>
          <div class="col-8">
            <input v-model="draft.imageUrl" type="url" class="form-control form-control-sm" aria-label="照片連結" />
          </div>
        </div>
        <div v-if="store.winnersOf(gift.id).length" class="mb-2">
          <span class="small lt-muted me-1">刪除中獎號碼：</span>
          <button
            v-for="winner in store.winnersOf(gift.id)"
            :key="winner.serial"
            type="button"
            class="btn btn-sm btn-outline-danger me-1 mb-1"
            :aria-label="`刪除 ${winner.serial} 號`"
            @click="store.deleteWinner(winner.serial)"
          >
            {{ winner.serial }} ✕
          </button>
        </div>
        <button type="submit" class="btn btn-sm btn-success me-2">儲存</button>
        <button type="button" class="btn btn-sm btn-outline-light me-2" @click="editingId = null">取消</button>
        <button type="button" class="btn btn-sm btn-outline-danger" @click="store.deleteGift(gift.id)">刪除禮物</button>
      </form>
      <div v-else class="d-flex align-items-center gap-2">
        <span class="flex-grow-1">{{ gift.name }}</span>
        <span class="small lt-muted">{{ store.winnersOf(gift.id).length }} / {{ gift.number }}</span>
        <button type="button" class="btn btn-sm btn-outline-light" :aria-label="`編輯「${gift.name}」`" @click="edit(gift)">
          <i class="fas fa-pen" aria-hidden="true"></i>
        </button>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.gift-item {
  padding: 0.6rem 0;
  border-top: 1px solid var(--lt-divider);
}
</style>
