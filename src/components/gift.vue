<template lang="html">
  <tr v-bind:class="{'table-active': isSelected}" v-on:click="updateSelectedGiftId">
    <td v-show="!editMode">
      {{ name }}<br>
      <img v-bind:src="imageUrl" onerror="this.src=''" style="object-fit: cover;">
    </td>
    <td v-show="editMode">
      <div class="form-group">
        <label>禮物名稱</label>
        <input type="text" class="form-control" v-model="name">
      </div>
      <div class="form-group">
        <label>照片連結</label>
        <input type="text" class="form-control" v-model="imageUrl">
      </div>
    </td>
    <td v-show="!editMode">
      已抽出 {{ winnerCounts }}<br/>
      剩下 {{ remaining }}<br/>
    </td>
    <td v-show="editMode">
      <div class="form-group">
        <label>禮物數量</label>
        <input type="text" class="form-control" v-model.number="number">
      </div>
    </td>
    <td>
      <div class="btn btn-sm btn-warning m-2" v-for="(winner, index) in winners">
        {{ winner.serial }} 號
        <i class="fas fa-times" v-show="editMode" v-on:click="deleteWinner(index)"></i>
      </div>
    </td>
    <td v-show="!editMode">
      <div class="btn btn-sm" v-on:click="editMode=true">
        <i class="fas fa-cog"></i>
      </div>
    </td>
    <td v-show="editMode">
      <div class="btn btn-outline-success m-2" v-on:click="editMode=false">
        <i class="fas fa-check"></i>
      </div>
      <div class="btn btn-outline-danger m-2" v-on:click="deleteGift">
        <i class="fas fa-trash-alt"></i>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['gid', 'gname', 'gnumber', 'gimageUrl', 'gwinners', 'indexAtGifts'],
  data: () => ({
    imageUrl: null,
    name: null,
    number: null,
    winners: [],
    editMode: false,
    selectedGift: window.lottery.selectedGift
  }),
  mounted: function () {
    this.name = this.gname,
    this.number = this.gnumber,
    this.imageUrl = this.gimageUrl
    this.winners = this.gwinners
  },
  methods: {
    deleteGift: function () {
      this.$emit('delete:gift')
    },
    deleteWinner: function (index) {
      this.$emit('delete:winner', index)
    },
    updateSelectedGiftId: function () {
      let index = this.indexAtGifts
      if (this.isSelected) index = null
      this.selectedGift.index = index
    },
  },
  computed: {
    isSelected: function () {
      return (this.indexAtGifts == this.selectedGift.index)
    },
    winnerCounts: function () {
      return this.winners.length
    },
    remaining: function () {
      return this.number - this.winnerCounts
    }
  },
  watch: {
    name: function () {
      this.$emit('update:gname', this.name)
    },
    number: function () {
      this.$emit('update:gnumber', this.number)
    },
    imageUrl: function () {
      this.$emit('update:gimageUrl', this.imageUrl)
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
