import { parseSave, type SaveData } from './lottery'

/** Share links carry the whole lottery in the URL fragment, which never reaches the server. */
export const SHARE_PREFIX = '#share='

/** Compresses the lottery into a URL-safe string. */
export async function encodeShare(save: SaveData): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify({ version: 2, ...save }))
  const compressed = await pipe(json, new CompressionStream('deflate-raw'))
  let binary = ''
  for (const byte of compressed) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

export async function decodeShare(code: string): Promise<SaveData> {
  let bytes: Uint8Array<ArrayBuffer>
  try {
    const binary = atob(code.replaceAll('-', '+').replaceAll('_', '/'))
    bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  } catch {
    throw new Error('分享連結格式不正確')
  }
  let json: string
  try {
    json = new TextDecoder().decode(await pipe(bytes, new DecompressionStream('deflate-raw')))
  } catch {
    throw new Error('分享連結內容已損毀')
  }
  return parseSave(json)
}

export function shareUrl(code: string, location: Pick<Location, 'origin' | 'pathname'> = window.location): string {
  return `${location.origin}${location.pathname}${SHARE_PREFIX}${code}`
}

/** Plain-text results to paste into a chat. */
export function resultsText(save: SaveData): string {
  const lines = ['🎄 抽獎結果']
  for (const gift of save.gifts) {
    const serials = save.winners.filter((w) => w.giftId === gift.id).map((w) => w.serial)
    lines.push(`${gift.name}（${serials.length}/${gift.number}）：${serials.length ? `${serials.join('、')} 號` : '還沒抽'}`)
  }
  const total = save.gifts.reduce((sum, g) => sum + g.number, 0)
  lines.push(`共 ${total} 份禮物，已抽出 ${save.winners.length} 位`)
  return lines.join('\n')
}

async function pipe(bytes: Uint8Array<ArrayBuffer>, transform: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const stream = new ReadableStream<Uint8Array<ArrayBuffer>>({
    start(controller) {
      controller.enqueue(bytes)
      controller.close()
    },
  }).pipeThrough(transform)
  return new Uint8Array(await new Response(stream).arrayBuffer())
}
