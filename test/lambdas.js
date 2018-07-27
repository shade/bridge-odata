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
  it ('Should work nested.', () => {
    // Find all the documents where there's a person who's names start with John and have at least one child taller than 170.
    let f = new Filter({
      left: 'People',
      operation: 'any',
      variable: 'a',
      inner: {
        left: 'a/Children',
        operation: 'all',
        variable: 'b',
        inner: {
          left: {
            left: 'a/Name',
            operation: 'startswith',
            right: '"John"'
          },
          operation: 'and',
          right: {
            left: 'b/Height',
            operation: 'ge',
            right: '170'
          }
        }
      }
    })

    assert.equal(f.toString(), 'People/any(a: a/Children/all(b: (startswith(a/Name,"John")) and (b/Height ge 170)))')

  })
})
