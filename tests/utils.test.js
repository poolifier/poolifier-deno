const { expect } = require('expect')
const {
  availableParallelism,
  isPlainObject,
  median,
  round
} = require('../lib/utils')
const {
  isKillBehavior,
  KillBehaviors
} = require('../lib/worker/worker-options')

describe('Utils test suite', () => {
  it('Verify availableParallelism() behavior', () => {
    expect(typeof availableParallelism() === 'number').toBe(true)
  })

  it('Verify median() computation', () => {
    expect(median([])).toBe(0)
    expect(median([0.08])).toBe(0.08)
    expect(median([0.25, 4.75, 3.05, 6.04, 1.01, 2.02, 5.03])).toBe(3.05)
    expect(median([0.25, 4.75, 3.05, 6.04, 1.01, 2.02])).toBe(2.535)
  })

  it('Verify round() behavior', () => {
    expect(round(0)).toBe(0)
    expect(round(0.5, 0)).toBe(1)
    expect(round(0.5)).toBe(0.5)
    expect(round(-0.5, 0)).toBe(-1)
    expect(round(-0.5)).toBe(-0.5)
    expect(round(1.005)).toBe(1.01)
    expect(round(2.175)).toBe(2.18)
    expect(round(5.015)).toBe(5.02)
    expect(round(-1.005)).toBe(-1.01)
    expect(round(-2.175)).toBe(-2.18)
    expect(round(-5.015)).toBe(-5.02)
  })

  it('Verify isPlainObject() behavior', () => {
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
    expect(isPlainObject(true)).toBe(false)
    expect(isPlainObject(false)).toBe(false)
    expect(isPlainObject(0)).toBe(false)
    expect(isPlainObject('')).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(() => {})).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject(new RegExp())).toBe(false)
    expect(isPlainObject(new Error())).toBe(false)
    expect(isPlainObject(new Map())).toBe(false)
    expect(isPlainObject(new Set())).toBe(false)
    expect(isPlainObject(new WeakMap())).toBe(false)
    expect(isPlainObject(new WeakSet())).toBe(false)
    expect(isPlainObject(new Int8Array())).toBe(false)
    expect(isPlainObject(new Uint8Array())).toBe(false)
    expect(isPlainObject(new Uint8ClampedArray())).toBe(false)
    expect(isPlainObject(new Int16Array())).toBe(false)
    expect(isPlainObject(new Uint16Array())).toBe(false)
    expect(isPlainObject(new Int32Array())).toBe(false)
    expect(isPlainObject(new Uint32Array())).toBe(false)
    expect(isPlainObject(new Float32Array())).toBe(false)
    expect(isPlainObject(new Float64Array())).toBe(false)
    expect(isPlainObject(new BigInt64Array())).toBe(false)
    expect(isPlainObject(new BigUint64Array())).toBe(false)
    expect(isPlainObject(new Promise(() => {}))).toBe(false)
    expect(isPlainObject(new WeakRef({}))).toBe(false)
    expect(isPlainObject(new FinalizationRegistry(() => {}))).toBe(false)
    expect(isPlainObject(new ArrayBuffer())).toBe(false)
    expect(isPlainObject(new SharedArrayBuffer())).toBe(false)
    expect(isPlainObject(new DataView(new ArrayBuffer()))).toBe(false)
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
  })

  it('Verify isKillBehavior() behavior', () => {
    expect(isKillBehavior(KillBehaviors.SOFT, KillBehaviors.SOFT)).toBe(true)
    expect(isKillBehavior(KillBehaviors.SOFT, KillBehaviors.HARD)).toBe(false)
    expect(isKillBehavior(KillBehaviors.HARD, KillBehaviors.HARD)).toBe(true)
    expect(isKillBehavior(KillBehaviors.HARD, KillBehaviors.SOFT)).toBe(false)
    expect(isKillBehavior(KillBehaviors.SOFT)).toBe(false)
    expect(isKillBehavior(KillBehaviors.HARD)).toBe(false)
    expect(isKillBehavior(KillBehaviors.HARD, null)).toBe(false)
    expect(isKillBehavior(KillBehaviors.SOFT, 'unknown')).toBe(false)
  })
})
