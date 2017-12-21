import Vue from 'vue/dist/vue.js'

const lottery = new Vue({
  el: '#lottery',
  data: {
    min: 1,
    max: 10,
    numbers: [],
    notification: ''
  },
  methods: {
    draw: () => {
      self = lottery
      const luckyNumber = self.candidateNumbers[Math.floor(Math.random() * self.candidateNumbers.length)]
      if (luckyNumber === undefined) {
        alert('所有號碼都被抽完了!')
      } else {
        self.numbers.push(luckyNumber)
        self.numbers = self.ascNumbers
        self.notification = `${luckyNumber}`
        return luckyNumber
      }
    },
    cancel: (number) => {
      const index = self.numbers.indexOf(number)
      return self.numbers.splice(index, 1)
    },
    clearNotification: () => {
      self.notification = ''
    }
  },
  computed: {
    ascNumbers: () => {
      self = lottery
      return self.numbers.sort((a, b) => {
        return a - b
      })
    },
    candidateNumbers: () => {
      self = lottery
      let ary = []
      for (let i = self.min; i <= self.max; i++) {
        if (!self.numbers.includes(i)) {
          ary.push(i)
        }
      }
      return ary
    }
  }
});
window.lottery = lottery
