export interface Config {
  min: number
  max: number
  /** How long the cart swings before a number is drawn. */
  msOfDrawing: number
  /** How long the drawn number shakes. */
  msOfNoticing: number
}

export interface Gift {
  id: number
  name: string
  number: number
  imageUrl: string | null
}

export interface Winner {
  serial: number
  giftId: number | null
  createdAt: string
  /** Set when the winner has come up to collect the gift. */
  appearedAt: string | null
}

export interface SaveData {
  config: Config
  gifts: Gift[]
  selectedGiftId: number | null
  winners: Winner[]
}

export const defaultConfig: Config = { min: 1, max: 100, msOfDrawing: 800, msOfNoticing: 1000 }

export function emptySave(): SaveData {
  return { config: { ...defaultConfig }, gifts: [], selectedGiftId: null, winners: [] }
}

/** Numbers that have not been drawn yet. */
export function availableNumbers(config: Config, winners: Winner[]): number[] {
  const drawn = new Set(winners.map((w) => w.serial))
  const numbers: number[] = []
  for (let n = config.min; n <= config.max; n++) if (!drawn.has(n)) numbers.push(n)
  return numbers
}

/** Why the next draw cannot happen, or null when it can. */
export function drawProblem(save: SaveData): string | null {
  if (availableNumbers(save.config, save.winners).length === 0) return '所有號碼都被抽完了！'
  const gift = save.gifts.find((g) => g.id === save.selectedGiftId)
  if (!gift) return '請先在中獎名單點選要抽的禮物'
  const drawn = save.winners.filter((w) => w.giftId === gift.id).length
  if (drawn >= gift.number) return `「${gift.name}」已經抽完了`
  return null
}

export function pickRandom<T>(items: T[], random: () => number = Math.random): T {
  return items[Math.floor(random() * items.length)]
}

/** Next gift id, one more than the largest so far. */
export function nextGiftId(gifts: Gift[]): number {
  return gifts.reduce((max, g) => Math.max(max, g.id + 1), 0)
}

/**
 * Reads an exported file. Accepts the current format and the Vuex store dumps
 * exported by the 2019 version: { config: { config }, gifts: { gifts, selectedId }, winners: { winners } }.
 */
export function parseSave(json: string): SaveData {
  const data = JSON.parse(json)
  if (data?.version === 2) {
    const { version: _version, ...save } = data
    return { ...emptySave(), ...save, config: { ...defaultConfig, ...save.config } }
  }
  if (data?.config?.config && data?.gifts?.gifts && data?.winners?.winners) {
    return {
      config: { ...defaultConfig, ...data.config.config },
      gifts: data.gifts.gifts,
      selectedGiftId: data.gifts.selectedId ?? null,
      winners: data.winners.winners,
    }
  }
  throw new Error('這不是抽獎紀錄檔')
}

export function stringifySave(save: SaveData): string {
  return JSON.stringify({ version: 2, ...save }, null, 2)
}
