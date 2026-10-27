<script setup lang="ts">
import { reactive } from 'vue'
import { useLotteryStore } from '../store'

const store = useLotteryStore()
const blank = () => ({ name: '禮物', number: 1, imageUrl: '' })
const form = reactive(blank())

function add() {
  store.addGift({ name: form.name, number: form.number, imageUrl: form.imageUrl || null })
  Object.assign(form, blank())
}
</script>

<template>
  <div class="container text-white">
    <h1 class="text-center">新增禮物</h1>
    <form class="mt-5" @submit.prevent="add">
      <div class="row mb-3">
        <label class="col col-form-label" for="gift-name">禮物名稱</label>
        <div class="col">
          <input id="gift-name" v-model="form.name" class="form-control" placeholder="iPhone 17" required />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col col-form-label" for="gift-number">禮物數量</label>
        <div class="col">
          <input id="gift-number" v-model.number="form.number" type="number" min="1" class="form-control" required />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label" for="gift-image">照片連結</label>
        <input id="gift-image" v-model="form.imageUrl" type="url" class="form-control" placeholder="https://i.imgur.com/iPhone.jpg" />
      </div>
      <div class="d-flex">
        <button type="submit" class="btn btn-secondary ms-auto">新增</button>
      </div>
    </form>
  </div>
</template>
