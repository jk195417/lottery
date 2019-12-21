<template lang="html">
 <tr v-bind:class="{'table-active': isSelected}" @click="updateSelectedGiftId">
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
      <div class="btn btn-sm btn-warning m-2" v-for="(winner, index) in winners" :key="index" @click.stop="setWinnerHasTakenGift(index, giftIndex)" :class="{'hasTakenGift': winner.hasTakenGift}">
        {{ winner.serial }} 號
        <i class="fas fa-times" v-show="editMode" @click.stop="deleteWinner(giftIndex, index)"></i>
      </div>
    </td>
    <td v-show="!editMode">
      <div class="btn btn-sm" @click="editMode=true">
        <i class="fas fa-cog"></i>
      </div>
    </td>
    <td v-show="editMode">
      <div class="btn btn-outline-success m-2" @click="editMode=false">
        <i class="fas fa-check"></i>
      </div>
      <div class="btn btn-outline-danger m-2" @click="deleteGift">
        <i class="fas fa-trash-alt"></i>
      </div>
    </td>
  </tr>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: [
    'giftIndex', 'gid', 'gname', 'gnumber', 'gimageUrl', 'gwinners', 'indexAtGifts'
  ],
  data: () => (
    {
      name: null,
      imageUrl: null,
      number: null,
      winners: [],
      editMode: false,
      selectedGift: window.lottery.selectedGift
    }
  ),
  mounted: function () {
    this.name = this.gname
    this.number = this.gnumber
    this.imageUrl = this.gimageUrl
    this.winners = this.gwinners
  },
  methods: {
    ...mapMutations(['m_deleteGift', 'm_deleteWinnerFromGift', 'm_setWinnerHasTakenGift', 'm_updateGiftName', 'm_updateGiftNumber', 'm_updateGiftImageURL']),
    deleteGift: function () {
      this.m_deleteGift(this.giftIndex)
    },
    deleteWinner: function (giftIndex, winnerIndex) {
      this.m_deleteWinnerFromGift({ giftIndex, winnerIndex })
    },
    setWinnerHasTakenGift (winnerID, giftIndex) {
      if (!this.editMode) {
        this.m_setWinnerHasTakenGift({ winnerID, giftIndex })
      }
    },
    updateSelectedGiftId: function () {
      let index = this.indexAtGifts
      if (this.isSelected) index = null
      this.selectedGift.index = index
    }
  },
  computed: {
    isSelected: function () {
      return (this.indexAtGifts === this.selectedGift.index)
    },
    winnerCounts: function () {
      return this.$store.state.Gifts[this.giftIndex].winners.length
    },
    remaining: function () {
      return this.number - this.winnerCounts
    },
    hasTakenCount: function () {
      return this.winners.filter(
        winner => {
          return winner.hasTakenGift
        }
      )
        .length
    }
  },
  watch: {
    name (name) {
      const giftIndex = this.giftIndex
      this.m_updateGiftName({ giftIndex, name })
    },
    number (number) {
      const giftIndex = this.giftIndex
      this.m_updateGiftNumber({ giftIndex, number })
    },
    imageUrl (imageUrl) {
      const giftIndex = this.giftIndex
      this.m_updateGiftImageURL({ giftIndex, imageUrl })
    },
    hasTakenCount (hasTakenCount) {
      const giftIndex = this.giftIndex
      this.winners = this.$store.state.Gifts[giftIndex].winners
    },
    remaining () {
      const giftIndex = this.giftIndex
      this.winners = this.$store.state.Gifts[giftIndex].winners
    }
  }
}
</script>

<style lang="css">
  .gift {
    width: 200px;
    text-align: left;
  }

  .hasTakenGift {
    border-color: gray;
    background-color: gray;
    text-decoration-line: line-through;
  }

  .hasTakenGift:hover {
    border-color: #333333;
    background-color: #cccccc;
  }
</style>
