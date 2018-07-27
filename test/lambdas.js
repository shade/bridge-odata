const Filter = require('../src/lib/filter')
const assert = require('assert')

describe('Try out any/all lambdas', () => {
  it('Should work normally', () => {

    let f = new Filter({
      left: 'people',
      operation: 'all',
      variable: 'v',
      inner: {
        left: 'v/Height',
        operation: 'le',
        right: '10'
      }
    })

    assert.equal(f.toString(), 'people/all(v: v/Height le 10)')
  })
  it('Should work with expr', () => {

    let f = new Filter({
      left: 'people',
      operation: 'all',
      variable: 'v',
      inner: {
        expr: 'lol'
      }
    })

    assert.equal(f.toString(), 'people/all(v: lol)')
  })
  it('Should work as a standalone string', () => {

    let f = new Filter({
      left: 'people',
      operation: 'all',
      variable: 'v',
      inner: 'lol'
    })

    assert.equal(f.toString(), 'people/all(v: lol)')
  })
})
