<template lang="html">
  <div class="container text-white">
    <h1 class="text-center">新增禮物</h1>
    <form class="mt-5">
      <div class="form-group row">
        <label class="col col-form-label">禮物名稱</label>
        <div class="col">
          <input type="text" class="form-control" v-model="name" placeholder="iPhone XR">
        </div>
      </div>
      <div class="form-group row">
        <label class="col col-form-label">禮物數量</label>
        <div class="col">
          <input type="text" class="form-control" v-model.number="number" placeholder="1">
        </div>
      </div>
      <div class="form-group">
        <label>照片連結</label>
        <input type="text" class="form-control" v-model="imageUrl" placeholder="https://i.imgur.com/iPhone-XR.jpg">
      </div>
      <div class="d-flex">
        <button type="button" name="button" class="btn btn-secondary ml-auto" v-on:click="newGift">新增</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    incrementingId: 0,
    name: '禮物',
    number: 1,
    imageUrl: null,
    gifts: window.lottery.gifts
  }),
  methods: {
    newGift: function () {
      this.incrementingId += 1
      let gift = {
        id: this.incrementingId,
        name: this.name,
        number: this.number,
        imageUrl: this.imageUrl,
        winners: []
      }
      this.gifts.push(gift)
      this.cleanForm()
    },
    cleanForm: function () {
      this.name = '禮物'
      this.number = 1
      this.imageUrl = null
    }
  }
}
</script>

<style lang="css">
</style>
