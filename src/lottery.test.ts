import { describe, expect, it } from 'vitest'
import {
  availableNumbers,
  drawProblem,
  emptySave,
  nextGiftId,
  parseSave,
  pickRandom,
  stringifySave,
  type SaveData,
} from './lottery'

const winner = (serial: number, giftId = 0) => ({ serial, giftId, createdAt: '', appearedAt: null })

describe('availableNumbers', () => {
  it('excludes numbers already drawn', () => {
    expect(availableNumbers({ ...emptySave().config, min: 1, max: 5 }, [winner(2), winner(4)])).toEqual([1, 3, 5])
  })
})

describe('drawProblem', () => {
  const save = (changes: Partial<SaveData>): SaveData => ({
    ...emptySave(),
    gifts: [{ id: 0, name: '禮物', number: 1, imageUrl: null }],
    selectedGiftId: 0,
    ...changes,
  })

  it('allows a draw when a gift with prizes left is selected', () => {
    expect(drawProblem(save({}))).toBeNull()
  })

  it('asks to select a gift first', () => {
    expect(drawProblem(save({ selectedGiftId: null }))).toMatch('請先')
  })

  it('stops when the selected gift is used up', () => {
    expect(drawProblem(save({ winners: [winner(7)] }))).toMatch('已經抽完了')
  })

  it('stops when every number is drawn', () => {
    const config = { ...emptySave().config, min: 1, max: 1 }
    expect(drawProblem(save({ config, winners: [winner(1, 9)] }))).toMatch('所有號碼')
  })
})

describe('pickRandom', () => {
  it('maps the random value onto the list', () => {
    expect(pickRandom([10, 20, 30], () => 0)).toBe(10)
    expect(pickRandom([10, 20, 30], () => 0.99)).toBe(30)
  })
})

describe('nextGiftId', () => {
  it('is one more than the largest id', () => {
    expect(nextGiftId([])).toBe(0)
    expect(nextGiftId([{ id: 3, name: '', number: 1, imageUrl: null }])).toBe(4)
  })
})

describe('parseSave', () => {
  it('reads files exported by the 2019 Vuex version', () => {
    const old = {
      config: { config: { min: 1, max: 50, msOfDrawing: 500, msOfNoticing: 900 } },
      gifts: { gifts: [{ id: 0, name: 'iPhone', number: 2, imageUrl: null }], selectedId: 0 },
      winners: { winners: [{ serial: 7, giftId: 0, createdAt: '2019-12-24T00:00:00.000Z', appearedAt: null }] },
    }
    const save = parseSave(JSON.stringify(old))
    expect(save.config.max).toBe(50)
    expect(save.selectedGiftId).toBe(0)
    expect(save.winners[0].serial).toBe(7)
  })

  it('round-trips the current format', () => {
    const save = { ...emptySave(), gifts: [{ id: 1, name: '咖啡機', number: 1, imageUrl: null }] }
    expect(parseSave(stringifySave(save))).toEqual(save)
  })

  it('rejects other JSON', () => {
    expect(() => parseSave('{"hello":1}')).toThrow('這不是抽獎紀錄檔')
  })
})
