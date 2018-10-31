<template lang="html">
  <div>
    <div
      class="card m-2 gift btn btn-outline-dark"
      v-bind:class="{'border-dark': isSelected}"
      v-on:click="updateSelectedGiftId">
      <div class="card-body" v-show="!editMode">
        <div class="btn btn-sm float-right" v-on:click="editMode=true">
          <i class="fas fa-cog"></i>
        </div>
        <h5 class="card-title">{{giftName}}</h5>
        <p class="card-text">X {{giftNumber}}</p>
      </div>
      <img class="card-img-bottom" v-show="!editMode" v-bind:src="giftImageUrl" onerror="this.src=''" style="object-fit: cover;">
      <div class="card-body" v-show="editMode">
        <form>
          <div class="form-group">
            <label>禮物名稱</label>
            <input type="text" class="form-control" v-model="giftName">
          </div>
          <div class="form-group">
            <label>禮物數量</label>
            <input type="text" class="form-control" v-model.number="giftNumber">
          </div>
          <div class="form-group">
            <label>照片連結</label>
            <input type="text" class="form-control" v-model="giftImageUrl">
          </div>
          <div class="d-flex">
            <button type="button" name="button" class="btn btn-outline-secondary" v-on:click="editMode=false">完成</button>
            <button type="button" name="button" class="btn btn-outline-danger ml-auto" v-on:click="deleteGift">刪除</button>
          </div>
        </form>
      </div>
      <!-- <winner v-for="w in winners"></winner> -->
    </div>
  </div>
</template>

<script>
import winner from './winner.vue'
export default {
  props: ['selectedGiftId', 'giftId', 'name', 'number', 'imageUrl'],
  data: () => ({
    editMode: false,
    giftImageUrl: null,
    giftName: null,
    giftNumber: null
  }),
  components: {
    'winner': winner
  },
  methods: {
    deleteGift: function () {
      this.$emit('delete:gift', this.giftId)
    },
    updateSelectedGiftId: function () {
      let selected = this.giftId
      if (this.isSelected) selected = null
      this.$emit('update:selectedGiftId', selected)
    }
  },
  computed: {
    isSelected: function () {
      return (this.giftId === this.selectedGiftId)
    }
  },
  mounted: function () {
    this.giftName = this.name,
    this.giftNumber = this.number,
    this.giftImageUrl = this.imageUrl
  },
  watch: {
    giftName: function () {
      this.$emit('update:name', this.giftName)
    },
    giftNumber: function () {
      this.$emit('update:number', this.giftNumber)
    },
    giftImageUrl: function () {
      this.$emit('update:imageUrl', this.giftImageUrl)
    }
  }
}
</script>

<style lang="css">
  .gift {
    width: 200px;
    text-align: left;
  }
</style>
