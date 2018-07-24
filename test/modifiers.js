let sdk = require('../src/index')
let filter = require('../src/lib/filter')
const assert = require('assert')

describe('modifiers', () => {
  it('should work, trivially', () => {
    const f = new filter({
      value: 'a',
      modifier: 'sec'
    })

    assert.equal(f.toString(), 'second(a)', 'second doesn\'t work')
  })

  it('should work nestedly', () => {
    const f = new filter({
      left: {
        value: 'a',
        modifier: 'sec'
      },
      operation: 'eq',
      right: 'b'
    })

    assert.equal(f.toString(), 'second(a) eq b', 'second doesn')
  })

  it('should work nestedly layer 2', () => {
    const f = new filter({
      left: {
        left: 'c',
        operation: 'eq',
        right: {
          value: 'a',
          modifier: 'hour'
        }
      },
      operation: 'and',
      right: 'b'
    })

    assert.equal(f.toString(), '(c eq hour(a)) and b', 'second layer nested modifier doesnt work')
  })
})
