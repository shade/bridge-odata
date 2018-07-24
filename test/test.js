const Retsly = require('../src/index')
const assert = require('assert')

describe('No param routes', () => {
  describe('Property', () => {
    it('should return a list of properties and get one', done => {
      let r = new Retsly(Retsly.TEST_TOKEN, 'test')
      r.Property()
      r.exec((err, res) => {
        assert(res.value.length > 0, 'should return more than one property')
        r
          .Property(res.value[0].ListingKey)
          .exec((err, res) => {
            assert(Object.keys(res).length > 4, 'should return one non invalid object')
            done()
          })
      })
    })
  })

  describe('OpenHouse', () => {
    it('should return a list of OpenHouse and get one', done => {
      let r = new Retsly(Retsly.TEST_TOKEN, 'test')
        .OpenHouse()
        r.exec((err, res) => {
          assert(res.value.length > 0, 'should return more than one property')
          r
            .OpenHouse(res.value[0].OpenHouseKey)
            .exec((err, res) => {
              assert(Object.keys(res).length > 4, 'should return one non invalid object')
              done()
            })
        })
    })
  })

  describe('Office', () => {
    it('should return a list of Office and get one', done => {
      let r = new Retsly(Retsly.TEST_TOKEN, 'test')
        .Office()
        r.exec((err, res) => {
          assert(res.value.length > 0, 'should return more than one property')
          r
            .Office(res.value[0].OfficeKey)
            .exec((err, res) => {
              assert(Object.keys(res).length > 4, 'should return one non invalid object')
              done()
            })
        })
    })
  })

  describe('Member', () => {
    it('should return a list of Member and get one', done => {
      let r = new Retsly(Retsly.TEST_TOKEN, 'test')
        .Member()
        r.exec((err, res) => {
          assert(res.value.length > 0, 'should return more than one property')
          r
            .Member(res.value[0].MemberKey)
            .exec((err, res) => {
              assert(Object.keys(res).length > 4, 'should return one non invalid object')
              done()
            })
        })
    })
  })
})
