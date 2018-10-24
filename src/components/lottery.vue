<template lang="html">
  <div class="container">
    <h2 class="d-flex justify-content-center align-items-center">
      抽獎範圍<button class="btn btn-sm btn-primary ml-2" data-toggle="collapse" data-target="#lottery-setting">設定</button>
    </h2>

    <div class="d-flex justify-content-around flex-wrap">
      <div class="h3"><span>{{ min }}號</span></div>
      <div class="h3"><span>{{ max }}號</span></div>
    </div>

    <div class="collapse my-2" id="lottery-setting">
      <div class="card card-body bg-secondary">
        <div class="form-row">
          <div class="form-group col">
            <label>最小號碼</label>
            <input class="form-control" v-model.number="min" type="number">
          </div>
          <div class="form-group col">
            <label>最大號碼</label>
            <input class="form-control" v-model.number="max" type="number">
          </div>
          <div class="form-group col">
            <label>抽獎時長(ms)</label>
            <input class="form-control" v-model.number="drawTime" type="number">
          </div>
          <div class="form-group col">
            <label>通知時長(ms)</label>
            <input class="form-control" v-model.number="noticeTime" type="number">
          </div>
        </div>
      </div>
    </div>

    <div
      class="alert alert-info text-center mt-4"
      v-bind:class="{ 'animated tada': noticing, 'd-none': (message.length === 0) }">
      抽中了<strong class="display-2 text-warning">{{ message }}</strong>號
      <button class="close" v-on:click="cleanMessage()"><span>&times;</span></button>
    </div>

    <div class="d-flex flex-wrap justify-content-center">
      <div class="xmas-santacart" v-on:click="draw" v-bind:class="{ 'animated swing disabled': drawing }"></div>
      <div class="w-100"></div>
      <div class="btn btn-lg btn-info" v-on:click="newGift">新禮物</div>
    </div>

    <h2 class="text-center">中獎名單
      <span class="small">
        已抽出<span class="text-warning h1">{{ selectedNumbers.length }}</span>位
      </span>
    </h2>
    
    <gift
      v-for="g in gifts"
      v-bind:min = "min"
      v-bind:max = "max"
      v-bind:selectedNumbers = "selectedNumbers"
      v-bind:name = "g.name"
      v-bind:limit = "g.limit"
      v-bind:winners = "g.winners"
      ></gift>
  </div>
</template>

<script>
import gift from './gift.vue';
export default {
  data: () => ({
    min: 1,
    max: 100,
    selectedNumbers: [],
    message: '',
    drawing: false,
    drawTime: 800,
    noticing: false,
    noticeTime: 1000,
    order: '抽出順序',
    gifts: []
  }),
  methods: {
    draw: function() {
      if (this.canDraw) {
        this.drawing = true
      } else {
        alert('所有號碼都被抽完了!')
      }
    },
    cancelSelected: function(n) {
      const i = this.selectedNumbers.indexOf(n)
      return this.selectedNumbers.splice(i, 1)
    },
    cleanMessage: function() {
      this.message = ''
    },
    newGift: function() {
      this.gifts.push()
    }
  },
  computed: {
    range: function() {
      const ary = []
      for (let i = this.min; i <= this.max; i++) {
        ary.push(i)
      }
      return ary;
    },
    canDraw: function() {
      return this.unselected.length > 0
    },
    ascSelected: function() {
      let copy = this.selectedNumbers.slice()
      return copy.sort(
        (a, b) => {
          return a - b
        }
      )
    },
    unselected: function() {
      return this.range.filter(n => this.selectedNumbers.indexOf(n) === -1);
    },
    sorted: function() {
      return this.order === '號碼順序'
    }
  },
  watch: {
    drawing: function() {
      if (!this.drawing) {
        return
      }
      const i = Math.floor(Math.random() * this.unselected.length)
      const n = this.unselected[i]
      setTimeout(() => {
        this.drawing = false
        this.selectedNumbers.push(n)
        this.message = n
        this.noticing = true
      }, this.drawTime)
    },
    noticing: function() {
      if (!this.noticing) {
        return
      }
      setTimeout(() => {
        this.noticing = false
      }, this.noticeTime)
    }
  },
  components: {
    'gift': gift
  }
}
</script>
