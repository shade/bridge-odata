const filter = require('../src/lib/filter')
const assert = require('assert')


describe('Simple filters', () => {
  describe('eq/neq/le/gte/gt', () => {
    it('Should work without a variable', () => {
      let operation = (op) => (new filter({
        left: 'a',
        operation: op,
        right: 'b'
      }))

      f = operation('eq')
      assert.equal(f.toString(), 'a eq b')
      f = operation('neq')
      assert.equal(f.toString(), 'a neq b')
      f = operation('ge')
      assert.equal(f.toString(), 'a ge b')
      f = operation('gt')
      assert.equal(f.toString(), 'a gt b')
      f = operation('lt')
      assert.equal(f.toString(), 'a lt b')
    })

    it('Should work recursively', () => {
      let f = new filter({
        left: {
          left: 'a',
          operation: 'eq',
          right: 'b'
        },
        operation: 'and',
        right: {
          left: 'a',
          operation: 'eq',
          right: 'c'
        }
      })

      assert.equal(f.toString(), '(a eq b) and (a eq c)')
    })
    it('Should work recursively, 2 levels', () => {
      let f = new filter({
        left: {
          left: 'a',
          operation: 'or',
          right: {
            left: 'b',
            operation: 'lt',
            right: 'c'
          }
        },
        operation: 'and',
        right: {
          left: 'a',
          operation: 'eq',
          right: 'c'
        }
      })

      assert.equal(f.toString(), '(a or (b lt c)) and (a eq c)')
    })
  })
})
