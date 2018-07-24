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
      comparator: 'eq',
      right: 'b'
    })

    assert.equal(f.toString(), '(second(a)) eq b', 'second doesn\'t work')
  })
})
