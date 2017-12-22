export default {
  template: `
    <div id="lottery">
      <section class="hero is-primary">
        <div class="hero-body">
          <div class="container has-text-centered">
            <h2 class="title is-spaced">抽獎範圍</h2>
            <nav class="level">
              <div class="level-item">
                <div>
                  <p class="title" v-cloak>最小 {{ min }} 號</p>
                </div>
              </div>
              <div class="level-item">
                <div>
                  <p class="title" v-cloak>最大 {{ max }} 號</p>
                </div>
              </div>
            </nav>
            <nav class="level has-text-centered">
              <div class="level-item">
                <div class="control">
                  <input class="input has-text-centered" v-model="min">
                </div>
              </div>
              <div class="level-item">
                <div class="control">
                  <input class="input has-text-centered" v-model="max">
                </div>
              </div>
            </nav>
            <a id="lottery-draw" class="button is-danger is-large" href="javascript: void(0);" v-on:click="draw" v-bind:class="{ 'animated swing is-loading': drawing }">抽獎</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="notification is-success has-text-centered" v-show="notification.length > 0" v-cloak v-bind:class="{ 'animated tada': noticing }">
            <button class="delete" v-on:click="clearNotification"></button> 抽中了 <span class="is-size-1">{{ notification }}</span> 號
          </div>
          <h2 class="title is-spaced has-text-centered">中獎號碼 <span class="subtitle">已抽出 <span class="is-size-2" v-cloak>{{ numbers.length }}</span> 位</span></h2>
          <div class="field is-grouped is-grouped-multiline">
            <div class="control" v-for="number in numbers" v-cloak>
              <div class="tags has-addons">
                <span class="tag is-large">{{ number }}</span>
                <a class="tag is-large is-delete" href="javascript: void(0);" v-on:click="cancel(number);"></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  data: () => ({
    min: 1,
    max: 10,
    numbers: [],
    notification: '',
    drawing: false,
    noticing: false,
    candidateNumbers: []
  }),
  methods: {
    draw () {
      this.candidateNumbers = []
      for (let i = this.min; i <= this.max; i++) {
        if (!this.numbers.includes(i)) {
          this.candidateNumbers.push(i)
        }
      }
      const luckyNumber = this.candidateNumbers[Math.floor(Math.random() * this.candidateNumbers.length)]
      if (luckyNumber === undefined) {
        alert('所有號碼都被抽完了!')
      } else {
        this.drawing = true
        setTimeout(() => {
          this.drawing = false
          this.numbers.push(luckyNumber)
          this.numbers = this.ascNumbers
          this.notification = `${luckyNumber}`
          this.noticing = true
          setTimeout(() => {
            this.noticing = false
          }, 2000)
        }, 2000)
        return luckyNumber
      }
    },
    cancel (number) {
      const index = this.numbers.indexOf(number)
      return this.numbers.splice(index, 1)
    },
    clearNotification: () => {
      this.notification = ''
    }
  },
  computed: {
    ascNumbers () {
      return this.numbers.sort((a, b) => {
        return a - b
      })
    }
  }
}
