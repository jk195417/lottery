<template lang="html">
  <div class="container">
    <!-- alert -->
    <div class="alert-frame mt-5">
      <div
        class="alert alert-info text-center"
        v-bind:class="{ 'animated tada': noticing }"
        v-show="flasingWinnerSerial">
        抽中了
        <strong class="display-2 text-warning">{{ flasingWinnerSerial }}</strong>
        號
        <button class="close" v-on:click="flasingWinnerSerial=null">
          <i class="far fa-times-circle"></i>
        </button>
      </div>
    </div>

    <!-- drawing btn -->
    <div class="text-center"><div class="xmas-santacart" v-on:click="draw" v-bind:class="{ 'animated swing disabled': drawing }"></div></div>

    <!-- gifts -->
    <div class="d-flex justify-content-between">
      <p class="small">總共有 <strong class="text-warning h1">{{ giftCounts }}</strong> 份禮物</p>
      <h1>中獎名單</h1>
      <p class="small">總計已抽出 <strong class="text-warning h1">{{ winnerCounts }}</strong> 位</p>
    </div>
    <table class="table">
      <tbody>
        <tr>
          <th>名稱</th>
          <th>數量</th>
          <th>中獎號碼</th>
          <th>#</th>
        </tr>
        <GiftList v-for="(gift, index) in $store.state.Gifts"
          :giftIndex="index"
          :index-at-gifts="index"
          :key="gift.id"
          :gid="gift.id"
          :gname="gift.name"
          :gnumber="gift.number"
          :gimage-url="gift.imageUrl"
          :gwinners="gift.winners"
        >
      </tbody>
    </table>
  </div>
</template>

<script>
import GiftList from './gift.vue'
import { mapMutations } from 'vuex'
export default {
  components: { GiftList },
  data: () => (
    {
      config: window.lottery.config,
      selectedGift: window.lottery.selectedGift,
      flasingWinnerSerial: null,
      drawing: false,
      noticing: false
    }
  ),
  methods: {
    ...mapMutations(['m_addWinnerToGift']),
    draw: function () {
      if (this.canDraw === true) {
        this.drawing = true
      } else {
        return alert(this.canDraw)
      }
    },
    randomWinner: function () {
      const index = Math.floor(Math.random() * this.unselectedNumbers.length)
      let winner = {
        serial: this.unselectedNumbers[index],
        time: new Date().toISOString(),
        hasTakenGift: false
      }
      let selectedGiftID = this.selectedGift.index
      this.m_addWinnerToGift({ selectedGiftID, winner })
      this.flasingWinnerSerial = winner.serial
    }
  },
  computed: {
    range: function () {
      return Array.from({ length: this.config.max - this.config.min + 1 }, (v, k) => k + this.config.min)
    },
    canDraw: function () {
      if (this.unselectedNumbers.length <= 0) return '所有號碼都被抽完了!'
      const selectedGift = this.$store.state.Gifts[this.selectedGift.index]
      if (selectedGift == null) return '請先選擇禮物'
      if (selectedGift.number <= selectedGift.winners.length) return '這個禮物已經被抽完了'
      return true
    },
    selectedNumbers: function () {
      let gifts = this.$store.state.Gifts
      return gifts.flatMap(
        gift => {
          return gift.winners.map(
            winner => {
              return winner.serial
            }
          )
        }
      )
    },
    unselectedNumbers: function () {
      return this.range.filter(n => this.selectedNumbers.indexOf(n) === -1)
    },
    giftCounts: function () {
      let gifts = this.$store.state.Gifts
      return gifts.reduce(
        (total, gift) => {
          return total + gift.number
        }
        , 0)
    },
    winnerCounts: function () {
      return this.selectedNumbers.length
    }
  },
  watch: {
    drawing: function () {
      if (!this.drawing) return false
      setTimeout(() => {
        this.noticing = true
        this.drawing = false
        this.randomWinner()
      }, this.config.msOfDrawing)
    },
    noticing: function () {
      if (!this.noticing) return false
      setTimeout(() => {
        this.noticing = false
      }, this.config.msOfNoticing)
    }
  }
}
</script>

<style lang="scss" scoped>
  .alert-frame {
    min-height: 10rem;
    margin-bottom: 1rem;
  }

  .alert {
    margin-bottom: 0;
  }
</style>
