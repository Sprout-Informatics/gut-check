export interface RNG {
  next(): number
  range(min: number, max: number): number
  gaussian(mean: number, stddev: number): number
  getSeed(): number
}

export function createRNG(seed: number): RNG {
  let state = seed | 0

  function mulberry32(): number {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    next(): number {
      return mulberry32()
    },

    range(min: number, max: number): number {
      return min + mulberry32() * (max - min)
    },

    gaussian(mean: number, stddev: number): number {
      // Box-Muller transform
      const u1 = mulberry32()
      const u2 = mulberry32()
      const z = Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2)
      return mean + z * stddev
    },

    getSeed(): number {
      return seed
    },
  }
}

export function fisherYatesShuffle<T>(array: T[], rng: RNG): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
