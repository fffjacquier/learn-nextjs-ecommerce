import formatMoney from '../lib/formatMoney'

describe('formatMoney function', () => {
  // it.skip or fit (only) or xit (skip)
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('€0.01')
    expect(formatMoney(40)).toEqual('€0.40')
    expect(formatMoney(9)).toEqual('€0.09')
  })

  it('leaves cents off for whole euros', () => {
    expect(formatMoney(5000)).toEqual('€50')
    expect(formatMoney(100)).toEqual('€1')
    expect(formatMoney(50000000)).toEqual('€500,000')
  })

  it('works with whole and fractional euro', () => {
    expect(formatMoney(1090)).toEqual('€10.90')
    expect(formatMoney(101)).toEqual('€1.01')
    expect(formatMoney(110)).toEqual('€1.10')
  })
})
