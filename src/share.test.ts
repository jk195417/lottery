import { describe, expect, it } from 'vitest'
import { emptySave, type SaveData } from './lottery'
import { decodeShare, encodeShare, resultsText, shareUrl } from './share'

const save: SaveData = {
  ...emptySave(),
  gifts: [
    { id: 0, name: '咖啡機', number: 2, imageUrl: 'https://example.com/coffee.jpg' },
    { id: 1, name: '禮券', number: 3, imageUrl: null },
  ],
  selectedGiftId: 0,
  winners: [
    { serial: 11, giftId: 0, createdAt: '2026-12-24T12:00:00.000Z', appearedAt: '2026-12-24T12:01:00.000Z' },
    { serial: 9, giftId: 0, createdAt: '2026-12-24T12:02:00.000Z', appearedAt: null },
  ],
}

describe('share link', () => {
  it('round-trips the lottery through a URL-safe code', async () => {
    const code = await encodeShare(save)
    expect(code).toMatch(/^[\w-]+$/)
    expect(await decodeShare(code)).toEqual(save)
  })

  it('builds the link from the current page', () => {
    expect(shareUrl('abc', { origin: 'https://yang-hong-xin.com', pathname: '/lottery/' })).toBe(
      'https://yang-hong-xin.com/lottery/#share=abc',
    )
  })

  it('rejects a broken code', async () => {
    await expect(decodeShare('!!!')).rejects.toThrow('分享連結格式不正確')
    await expect(decodeShare('AAAA')).rejects.toThrow('分享連結內容已損毀')
  })
})

describe('resultsText', () => {
  it('lists the winners of every gift', () => {
    expect(resultsText(save)).toBe(
      ['🎄 抽獎結果', '咖啡機（2/2）：11、9 號', '禮券（0/3）：還沒抽', '共 5 份禮物，已抽出 2 位'].join('\n'),
    )
  })
})
