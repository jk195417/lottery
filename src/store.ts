import { defineStore } from 'pinia'
import { emptySave, nextGiftId, type Config, type Gift, type SaveData } from './lottery'

export const useLotteryStore = defineStore('lottery', {
  state: (): SaveData => emptySave(),
  getters: {
    giftTotal: (state) => state.gifts.reduce((sum, g) => sum + g.number, 0),
    winnerCount: (state) => state.winners.length,
    winnersOf: (state) => (giftId: number) => state.winners.filter((w) => w.giftId === giftId),
  },
  actions: {
    updateConfig(config: Partial<Config>) {
      Object.assign(this.config, config)
    },
    addGift(gift: Omit<Gift, 'id'>) {
      this.gifts.push({ ...gift, id: nextGiftId(this.gifts) })
    },
    updateGift(id: number, changes: Partial<Omit<Gift, 'id'>>) {
      const gift = this.gifts.find((g) => g.id === id)
      if (gift) Object.assign(gift, changes)
    },
    deleteGift(id: number) {
      // Its winners stay, so numbers already announced are not drawn again
      this.gifts = this.gifts.filter((g) => g.id !== id)
      if (this.selectedGiftId === id) this.selectedGiftId = null
    },
    selectGift(id: number) {
      this.selectedGiftId = id
    },
    addWinner(serial: number, giftId: number) {
      this.winners.push({ serial, giftId, createdAt: new Date().toISOString(), appearedAt: null })
    },
    deleteWinner(serial: number) {
      this.winners = this.winners.filter((w) => w.serial !== serial)
    },
    toggleAppeared(serial: number) {
      const winner = this.winners.find((w) => w.serial === serial)
      if (winner) winner.appearedAt = winner.appearedAt ? null : new Date().toISOString()
    },
    load(save: SaveData) {
      this.$patch((state) => Object.assign(state, save))
    },
    reset() {
      this.load(emptySave())
    },
  },
})
