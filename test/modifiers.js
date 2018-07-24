let sdk = require('../src/index')
let filter = require('../src/lib/filter')
const assert = require('assert')

describe('modifiers', () => {
  it('should not work with redundant fields', () => {
    const f = new filter({
      value: 'a',
      modifier: 'sec'
    })

    assert.equal(f.toString(), 'second(a)', 'second doesn\'t work')
  })
})
