<template lang="html">
  <div class="container">
    <div
      class="alert alert-info text-center mt-5"
      v-bind:class="{ 'animated tada': noticing, 'd-none': (flasingWinnerId == null) }">
      抽中了 <strong class="display-2 text-warning">{{ flasingWinnerId }}</strong> 號
      <button class="close" v-on:click="flasingWinnerId=null"><span>&times;</span></button>
    </div>
    <div class="d-flex flex-wrap justify-content-center">
      <div class="xmas-santacart" v-on:click="draw" v-bind:class="{ 'animated swing disabled': drawing }"></div>
      <div class="w-100"></div>
      <h2>中獎名單
        <span class="small">
          已抽出 <span class="text-warning h1">{{ winners.length }}</span> 位
        </span>
      </h2>
      <div class="w-100"></div>
    </div>

    <div class="card-group justify-content-center">
      <gift
        v-for="(gift, index) in gifts"
        v-bind:gift-id.sync="gift.id"
        v-bind:name.sync="gift.name"
        v-bind:number.sync="gift.number"
        v-bind:image-url.sync="gift.imageUrl"
        v-bind:selected-gift-id.sync="selectedGiftId"
        v-on:delete:gift="deleteGift"></gift>
    </div>
  </div>
</template>

<script>
import gift from './gift.vue';
export default {
  data: () => ({
    config: window.lottery.config,
    winners: window.lottery.winners,
    gifts: window.lottery.gifts,
    flasingWinnerId: null,
    drawing: false,
    noticing: false,
    selectedGiftId: null
  }),
  methods: {
    draw: function () {
      if (!this.canDraw) return alert('所有號碼都被抽完了!')
      this.drawing = true
    },
    randomWinner: function () {
      const index = Math.floor(Math.random() * this.unselectedNumbers.length)
      const winner = {
        id: this.unselectedNumbers[index],
        giftId: this.selectedGiftId,
        time: new Date().toISOString()
      }
      this.winners.push(winner)
      this.flasingWinnerId = winner.id;
    },
    deleteGift: function (id) {
      let index = this.gifts.findIndex((gift) => {
          return gift.id === id
      })
      this.gifts.splice(index, 1)
    }
  },
  computed: {
    range: function () {
      return Array.from({length: this.config.max - this.config.min + 1}, (v, k) => k + this.config.min)
    },
    canDraw: function () {
      return this.unselectedNumbers.length > 0
    },
    selectedNumbers: function () {
      return this.winners.map((winner) => {
        return winner.id
      })
    },
    unselectedNumbers: function () {
      return this.range.filter(n => this.selectedNumbers.indexOf(n) === -1)
    },
    giftWinners: function (giftId) {
      return this.winners.filter(winner => winner.giftId === giftId)
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
    'gift': gift
  }
}
</script>
