<template lang="html">
  <div class="container">
    <!-- alert -->
    <div
      class="alert alert-info text-center mt-5"
      v-bind:class="{ 'animated tada': noticing }"
      v-show="flasingWinnerSerial">
      抽中了
      <strong class="display-2 text-warning">{{ flasingWinnerSerial }}</strong>
      號
      <button class="close" v-on:click="flasingWinnerSerial=null">
        <i class="far fa-times-circle"></i>
      </button>
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
        <tr is="gift" v-for="(gift, index) in gifts"
          v-bind:giftIndex="index"
          v-bind:index-at-gifts="index"
          v-bind:key="gift.id"
          v-bind:gid="gift.id"
          v-bind:gname.sync="gift.name"
          v-bind:gnumber.sync="gift.number"
          v-bind:gimage-url.sync="gift.imageUrl"
          v-bind:gwinners="gift.winners"
          v-on:delete:gift="deleteGift(index)"
          v-on:delete:winner="deleteWinner(index, $event)"
          v-on:setWinnerHasTakenGift="setWinnerHasTakenGift"></tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import gift from './gift.vue'
export default {
  data: () => (
    {
      config: window.lottery.config,
      gifts: window.lottery.gifts,
      selectedGift: window.lottery.selectedGift,
      flasingWinnerSerial: null,
      drawing: false,
      noticing: false
    }
  ),
  methods: {
    draw: function () {
      if (this.canDraw === true){
        this.drawing = true
      } else {
        return alert(this.canDraw)
      }
    },
    randomWinner: function () {
      const index = Math.floor(Math.random() * this.unselectedNumbers.length)
      const winner = {
        serial: this.unselectedNumbers[index],
        time: new Date().toISOString(),
        hasTakenGift: false
      }
      this.gifts[this.selectedGift.index].winners.push(winner)
      this.flasingWinnerSerial = winner.serial;
    },
    deleteGift: function (index) {
      this.gifts.splice(index, 1)
    },
    deleteWinner: function (index, windex) {
      this.gifts[index].winners.splice(windex, 1)
    },
    setWinnerHasTakenGift (winnerID, _giftIndex) {
      try{
        // console.log(_giftIndex)
        // console.log(winnerID)
        this.gifts[_giftIndex].winners[winnerID].hasTakenGift = !this.gifts[_giftIndex].winners[winnerID].hasTakenGift
        // console.log(this.gifts[_giftIndex].winners[winnerID].hasTakenGift)
        if (!this.gifts[_giftIndex].winners[winnerID].hasTakenGift) {
          alert('已更改 ' + this.gifts[_giftIndex].winners[winnerID].serial + ' 號為「未領取」')
        }
      } catch { console.log('this number has been deleted') }
    }
  },
  computed: {
    range: function () {
      return Array.from({length: this.config.max - this.config.min + 1}, (v, k) => k + this.config.min)
    },
    canDraw: function () {
      if (this.unselectedNumbers.length <= 0) return '所有號碼都被抽完了!'
      const selectedGift = this.gifts[this.selectedGift.index]
      if (selectedGift == null) return '請先選擇禮物'
      if (selectedGift.number <= selectedGift.winners.length) return '這個禮物已經被抽完了'
      return true
    },
    selectedNumbers: function () {
      return this.gifts.flatMap((gift) => {
        return gift.winners.map((winner) => {
          return winner.serial
        })
      })
    },
    unselectedNumbers: function () {
      return this.range.filter(n => this.selectedNumbers.indexOf(n) === -1)
    },
    giftCounts: function () {
      return this.gifts.reduce((total, gift) => {
        return total + gift.number
      }, 0)
    },
    winnerCounts: function () {
      return this.selectedNumbers.length
    }
  },
  watch: {
    drawing: function() {
      if (!this.drawing) return false
      setTimeout(() => {
        this.noticing = true
        this.drawing = false
        this.randomWinner()
      }, this.config.msOfDrawing)
    },
    noticing: function() {
      if (!this.noticing) return false
      setTimeout(() => {
        this.noticing = false
      }, this.config.msOfNoticing)
    }
  },
  components: {
    'gift': gift,
  }
}
</script>
