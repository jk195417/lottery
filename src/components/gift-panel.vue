<template lang="html">
  <div class="container text-white">
    <h1 class="text-center">
      新增禮物
    </h1>
    <form class="mt-5">
      <div class="form-group row">
        <label class="col col-form-label">禮物名稱</label>
        <div class="col">
          <input
            v-model="name"
            type="text"
            class="form-control"
            placeholder="iPhone 11"
          >
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">禮物數量</label>
        <div class="col">
          <input
            v-model.number="number"
            type="text"
            class="form-control"
            placeholder="1"
          >
        </div>
      </div>
      <div class="form-group">
        <label>照片連結</label>
        <input
          v-model="imageUrl"
          type="text"
          class="form-control"
          placeholder="https://i.imgur.com/iPhone-11.jpg"
        >
      </div>
      <div class="d-flex">
        <button
          type="button"
          name="button"
          class="btn btn-secondary ml-auto"
          @click="addGift"
        >
          新增
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Gift from '../models/gift'
export default {
  data: () => ({
    name: null,
    number: null,
    imageUrl: null
  }),
  mounted: function () {
    this.reset()
  },
  methods: {
    addGift: function () {
      const gift = new Gift(this.name, this.number, this.imageUrl)
      this.$store.commit('gifts/add', { gift: gift })
      this.reset()
    },
    reset: function () {
      this.name = '禮物'
      this.number = 1
      this.imageUrl = null
    }
  }
}
</script>

<style lang="css"></style>
