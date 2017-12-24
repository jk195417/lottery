export default {
  el: '#app',
  template: `
  <div id="lottery" v-cloak>
    <div class="jumbotron bg-transparent">
      <h2 class="text-center">抽獎範圍
        <button class="btn btn-sm btn-info" data-toggle="collapse" data-target="#lottery-setting">設定</button>
      </h2>
      <div class="d-flex justify-content-around flex-wrap">
        <div class="h3">
          <span>{{ min }} 號</span>
        </div>
        <div class="h3">
          <span>{{ max }} 號</span>
        </div>
      </div>
      <div class="collapse my-2" id="lottery-setting">
        <div class="card card-body bg-info">
          <div class="form-row">
            <div class="form-group col">
              <label>最小號碼</label>
              <input class="form-control" v-model="min">
            </div>
            <div class="form-group col">
              <label>最大號碼</label>
              <input class="form-control" v-model="max">
            </div>
            <div class="form-group col">
              <label>排序方法</label>
              <select class="form-control" v-model="order">
                <option>抽出順序</option>
                <option>號碼順序</option>
              </select>
            </div>
            <div class="form-group col">
              <label>抽獎時長(ms)</label>
              <input class="form-control" v-model="drawTime">
            </div>
            <div class="form-group col">
              <label>通知時長(ms)</label>
              <input class="form-control" v-model="noticeTime">
            </div>
          </div>
        </div>
      </div>
      <div class="alert alert-info text-center mt-4" v-bind:class="{ 'animated tada': noticing, 'd-none': message.length === 0 }">
        抽中了 <strong class="display-2 text-warning">{{ message }}</strong> 號
        <button class="close" v-on:click="cleanMessage()">
          <span>&times;</span>
        </button>
      </div>
      <div class="d-flex flex-wrap justify-content-center">
        <div class="xmas-santacart" v-on:click="draw" v-bind:class="{ 'animated swing disabled': drawing }"></div>
        <div class="w-100"></div>
        <div class="btn btn-lg btn-info" v-on:click="addHr">換行</div>
      </div>
    </div>
    <div class="container">
      <h2 class="text-center">中獎名單
        <span class="small">已抽出 <span class="text-warning h1" >{{ selected.length }}</span> 位</span>
      </h2>
      <div class="row">
        <div class="col-10">
          <div id="unsorted" v-bind:class="[sorted ? 'd-none' : 'd-flex flex-wrap align-items-center']">
            <h2 contenteditable="true">中獎:</h2>
            <button class="btn btn-lg btn-warning m-2" v-for="n in selected" v-on:click="cancelSelected(n)">
              {{ n }} 號<span class="close ml-2">&times;</span>
            </button>
          </div>
          <div v-bind:class="[sorted ? 'd-flex flex-wrap align-items-center' : 'd-none']">
            <button class="btn btn-lg btn-warning m-2" v-for="n in ascSelected" v-on:click="cancelSelected(n)">
              {{ n }} 號<span class="close ml-2">&times;</span>
            </button>
          </div>
        </div>
        <div class="col-2">
          <div class="xmas-tree"></div>
        </div>
      </div>
    </div>
  </div>
  `,
  data: () => ({
    min: 1,
    max: 100,
    selected: [],
    message: '',
    drawing: false,
    drawTime: 800,
    noticing: false,
    noticeTime: 1000,
    order: '抽出順序',
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
      const i = this.selected.indexOf(n)
      return this.selected.splice(i, 1)
    },
    cleanMessage: function() {
      this.message = ''
    },
    addHr: function() {
      $('#unsorted').append('<hr class="w-100"/><h2 contenteditable="true">中獎:</h2>')
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
      let copy = this.selected.slice()
      return copy.sort(
        (a, b) => {
          return a - b
        }
      )
    },
    unselected: function() {
      return this.range.filter(n => this.selected.indexOf(n) === -1);
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
        this.selected.push(n)
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
  }
}
