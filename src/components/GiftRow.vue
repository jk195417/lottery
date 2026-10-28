<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Gift } from '../lottery'
import { useLotteryStore } from '../store'

const props = defineProps<{ gift: Gift }>()
const store = useLotteryStore()
const editing = ref(false)
const imageFailed = ref(false)
const draft = reactive({ name: '', number: 1, imageUrl: '' })

const winners = computed(() => store.winnersOf(props.gift.id))
const selected = computed(() => store.selectedGiftId === props.gift.id)

function edit() {
  Object.assign(draft, { name: props.gift.name, number: props.gift.number, imageUrl: props.gift.imageUrl ?? '' })
  editing.value = true
}

function save() {
  store.updateGift(props.gift.id, { name: draft.name, number: draft.number, imageUrl: draft.imageUrl || null })
  imageFailed.value = false
  editing.value = false
}
</script>

<template>
  <tr :class="{ 'table-active': selected }" :aria-selected="selected" @click="store.selectGift(gift.id)">
    <template v-if="!editing">
      <td>
        {{ gift.name }}
        <img
          v-if="gift.imageUrl && !imageFailed"
          :src="gift.imageUrl"
          :alt="gift.name"
          class="gift-image d-block mt-1"
          @error="imageFailed = true"
        />
      </td>
      <td>
        已抽出 {{ winners.length }}<br />
        剩下 {{ gift.number - winners.length }}
      </td>
    </template>
    <template v-else>
      <td colspan="2" @click.stop>
        <form class="row g-2" @submit.prevent="save">
          <div class="col-12 col-md-5">
            <label class="form-label small mb-0" :for="`name-${gift.id}`">禮物名稱</label>
            <input :id="`name-${gift.id}`" v-model="draft.name" class="form-control" required />
          </div>
          <div class="col-12 col-md-2">
            <label class="form-label small mb-0" :for="`number-${gift.id}`">數量</label>
            <input :id="`number-${gift.id}`" v-model.number="draft.number" type="number" min="1" class="form-control" required />
          </div>
          <div class="col-12 col-md-5">
            <label class="form-label small mb-0" :for="`image-${gift.id}`">照片連結</label>
            <input :id="`image-${gift.id}`" v-model="draft.imageUrl" type="url" class="form-control" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-outline-success btn-sm me-2"><i class="fas fa-check" aria-hidden="true"></i> 儲存</button>
            <button type="button" class="btn btn-outline-danger btn-sm" @click="store.deleteGift(gift.id)">
              <i class="fas fa-trash-alt" aria-hidden="true"></i> 刪除禮物
            </button>
          </div>
        </form>
      </td>
    </template>
    <td>
      <span v-for="winner in winners" :key="winner.serial" class="btn-group btn-group-sm m-1">
        <button
          type="button"
          class="btn"
          :class="winner.appearedAt ? 'btn-secondary text-decoration-line-through' : 'btn-warning'"
          :title="winner.appearedAt ? '已領獎，點一下取消' : '點一下標記已領獎'"
          :aria-pressed="!!winner.appearedAt"
          @click.stop="store.toggleAppeared(winner.serial)"
        >
          {{ winner.serial }} 號
        </button>
        <button
          v-if="editing"
          type="button"
          class="btn btn-outline-danger"
          :aria-label="`刪除 ${winner.serial} 號`"
          @click.stop="store.deleteWinner(winner.serial)"
        >
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </span>
    </td>
    <td class="text-end">
      <button v-if="!editing" type="button" class="btn btn-sm" :aria-label="`編輯「${gift.name}」`" @click.stop="edit">
        <i class="fas fa-cog" aria-hidden="true"></i>
      </button>
      <button v-else type="button" class="btn btn-sm" aria-label="取消編輯" @click.stop="editing = false">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </td>
  </tr>
</template>

<style scoped>
tr {
  cursor: pointer;
}
.gift-image {
  max-width: 200px;
  max-height: 120px;
  object-fit: cover;
}
</style>
