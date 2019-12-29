<template lang="html">
  <div class="container">
    <!-- alert -->
    <div class="alert-frame mt-5">
      <div
        v-show="serial"
        class="alert alert-info text-center"
        :class="{ 'animated tada': noticing }"
      >
        抽中了 <strong class="display-2 text-warning">{{ serial }}</strong> 號
        <button
          class="close"
          @click="serial = null"
        >
          <i class="far fa-times-circle" />
        </button>
      </div>
    </div>

    <!-- drawing btn -->
    <div class="text-center">
      <div
        class="xmas-santacart"
        :class="{ 'animated swing disabled': drawing }"
        @click="draw"
      />
    </div>

    <!-- gifts -->
    <div class="d-flex justify-content-between">
      <p class="small">
        總共有
        <strong class="text-warning h1">{{
          $store.getters['gifts/sum']
        }}</strong>
        份禮物
      </p>
      <h1>中獎名單</h1>
      <p class="small">
        總計已抽出
        <strong class="text-warning h1">{{
          $store.getters['winners/count']
        }}</strong>
        位
      </p>
    </div>
    <table class="table">
      <tbody>
        <tr>
          <th>名稱</th>
          <th>數量</th>
          <th>中獎號碼</th>
          <th>#</th>
        </tr>
        <gift-row
          v-for="(gift, index) in gifts"
          :key="gift.index"
          :gift="gift"
          :index="index"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import giftRow from './gift-row'
import Winner from '../models/winner'
import { mapState } from 'vuex'

export default {
  components: { giftRow },
  data: () => ({
    serial: null,
    drawing: false,
    noticing: false
  }),

  computed: {
    ...mapState({
      config: state => state.config.config,
      gifts: state => state.gifts.gifts
    }),
    canDraw () {
      if (this.pool.length <= 0) return '所有號碼都被抽完了!'
      const gift = this.$store.getters['gifts/selected']
      if (!gift) return '請先選擇禮物'
      const winners = this.$store.getters['winners/belongsToGift'](gift.id)
      if (gift.number <= winners.length) return '這個禮物已經被抽完了'
      return true
    },
    pool () {
      const pool = this.$store.getters['config/pool']
      const serials = this.$store.getters['winners/serials']
      return pool.filter(n => !serials.includes(n))
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
  },
  methods: {
    draw () {
      if (this.canDraw === true) {
        this.drawing = true
      } else {
        // TODO: Using sweet alert 2 to show alert
        return alert(this.canDraw)
      }
    },
    randomWinner () {
      const gift = this.$store.getters['gifts/selected']
      const random = Math.floor(Math.random() * this.pool.length)
      const serial = this.pool[random]
      const winner = new Winner(serial, gift.id)
      this.$store.commit('winners/add', { winner })
      this.serial = winner.serial
    }
  }
}
</script>

<style lang="css" scoped>
.alert-frame {
  min-height: 10rem;
  margin-bottom: 1rem;
}

.alert {
  margin-bottom: 0;
}
</style>
