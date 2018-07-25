const Filter = require('../src/lib/filter')
const assert = require('assert')


describe('Filters with Custom Functions', () => {
  describe('Dot Arrow Notation Functions', () => {
    it('Should work with correct names', () => {
      let f = new Filter({
        left: 'a',
        right: 'b',
        operation: (left, right) => `${left} == ${right}`
      })

      assert.equal(f.toString(), 'a == b', `${f.toString()} Doesnt work with same param names`)
    })
    it('Should work with switched param names', () => {
      let f = new Filter({
        left: 'a',
        right: 'b',
        operation: (right, left) => `${left} == ${right}`
      })

      assert.equal(f.toString(), 'a == b', `${f.toString()} Doesnt work with same param names`)
    })
    it('Should throw if more params added', () => {

      assert.throws(() => {
        let f = new Filter({
          left: 'a',
          right: 'b',
          operation: (right, a, left) => `${left} =${a}= ${right}`
        })
      }, Error)
    })
    it('Should throw if less params added', () => {

      assert.throws(() => {
        let f = new Filter({
          left: 'a',
          right: 'b',
          operation: (left) => `${left} == lol`
        })
      }, Error)
    })
  })

  describe('Standard Anonymous Function notation', () => {
    it('Should work with correct names', () => {
      let f = new Filter({
        left: 'a',
        right: 'b',
        operation: function (left, right) {
          return `${left} == ${right}`
        }
      })

      assert.equal(f.toString(), 'a == b', `${f.toString()} Doesnt work with same param names`)
    })
    it('Should work with switched param names', () => {
      let f = new Filter({
        left: 'a',
        right: 'b',
        operation: (right, left) => `${left} == ${right}`
      })

      assert.equal(f.toString(), 'a == b', `${f.toString()} Doesnt work with same param names`)
    })
    it('Should throw if more params added', () => {

      assert.throws(() => {
        let f = new Filter({
          left: 'a',
          right: 'b',
          operation: (right, a, left) => `${left} =${a}= ${right}`
        })
      }, Error)
    })
    it('Should throw if less params added', () => {

      assert.throws(() => {
        let f = new Filter({
          left: 'a',
          right: 'b',
          operation: (left) => `${left} == lol`
        })
      }, Error)
    })
  })
})
