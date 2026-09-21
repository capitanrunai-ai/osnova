import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
// Extract the actual amplitude envelope of the supplied PCM WAV, not a decorative waveform.
const root = resolve(import.meta.dirname, '..')
const wav = await readFile(resolve(root, 'primer.wav'))
let channels, bits, data
for (let offset = 12; offset + 8 <= wav.length;) {
  const id = wav.toString('ascii', offset, offset + 4)
  const size = wav.readUInt32LE(offset + 4)
  if (id === 'fmt ') { channels = wav.readUInt16LE(offset + 10); bits = wav.readUInt16LE(offset + 22) }
  if (id === 'data') data = wav.subarray(offset + 8, offset + 8 + size)
  offset += 8 + size + (size % 2)
}
if (!data || bits !== 24) throw new Error('Expected source 24-bit PCM WAV')
const stride = channels * 3
const frames = Math.floor(data.length / stride)
const bins = Array.from({ length: 96 }, (_, i) => {
  const start = Math.floor(i * frames / 96)
  const end = Math.floor((i + 1) * frames / 96)
  let sum = 0, count = 0
  for (let frame = start; frame < end; frame += 24) {
    const sample = data.readIntLE(frame * stride, 3) / 8388608
    sum += sample * sample; count++
  }
  return Math.sqrt(sum / count)
})
const max = Math.max(...bins)
await writeFile(resolve(root, 'src/data/voiceWaveform.json'), JSON.stringify(bins.map(n => Number((n / max).toFixed(3)))) + '\n')
