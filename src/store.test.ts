import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLotteryStore } from './store'

describe('lottery store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('deletes the gift that was asked for', () => {
    // The 2019 version deleted the last gift whatever row was clicked
    const store = useLotteryStore()
    for (const name of ['A', 'B', 'C']) store.addGift({ name, number: 1, imageUrl: null })
    store.deleteGift(store.gifts[0].id)
    expect(store.gifts.map((g) => g.name)).toEqual(['B', 'C'])
  })

  it('keeps winners of a deleted gift so their numbers are not drawn again', () => {
    const store = useLotteryStore()
    store.addGift({ name: 'A', number: 1, imageUrl: null })
    store.addWinner(7, store.gifts[0].id)
    store.deleteGift(store.gifts[0].id)
    expect(store.winners.map((w) => w.serial)).toEqual([7])
  })

  it('marks a winner as collected and back', () => {
    const store = useLotteryStore()
    store.addWinner(7, 0)
    store.toggleAppeared(7)
    expect(store.winners[0].appearedAt).not.toBeNull()
    store.toggleAppeared(7)
    expect(store.winners[0].appearedAt).toBeNull()
  })
})
