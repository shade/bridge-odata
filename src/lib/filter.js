/* jshint esversion: 6 */
const {
  COMPARATOR_MAP
} = require('./maps')

const QUERY_TYPES = {
  NORMAL: 0x00,
  LAMBDA: 0x01,
  MODIFIER: 0x02,
  GEO_DISTANCE: 0x03
}

class FilterNode {
  constructor (obj) {
    const { left, comparator, right, variable, expr } = obj

    if (expr) {
      this.str = expr
      return
    }

    // If this is a lambda, must have a variable
    this._checkVerifyLambda(obj)
    // Make sure proper params are set
    this._checkVerifyExpression(obj)

    // Set the subject values recursively.
    if (typeof obj.left === 'object') {
      this.subject = new FilterNode(obj.left).toString()
    } else {
      this.subject = obj.left
    }

    // Set the object values recursively.
    if (typeof obj.right === 'object') {
      this.object = new FilterNode(obj.right).toString()
    } else {
      this.object = obj.right
    }

    this.comparator = obj.comparator
  }

  _checkVerifyLambda (obj) {
    if (obj.comparator === 'any' || obj.comparator === 'all') {
      if (!obj.variable) {
        throw new Error('Lambda expressions (any, all), must specify a variable')
      }
    }
  }

  _checkVerifyExpression (obj) {
    const { left, comparator, right, variable, expression } = obj

    if (expression && (left || comparator || right || variable)) {
      throw new Error('expression overrides (subject, comparator, object, and variable) please clean your $filter param')
    }

    if (!expression) {
      if (!(left || comparator || right)) {
        throw new Error('(subject, comparator, and object) must be specified, otherwise use `expression`')
      }
    }
  }

  toString () {
    let str = this.str || ''

    if (str) {
      return str
    }

    switch (this.type) {
      case QUERY_TYPES.NORMAL:
        this.str = '';
      break
      case QUERY_TYPES.LAMBDA:
        this.str = '';
      break
      case QUERY_TYPES.MODIFIER:
        this.str = '';
      break
      case QUERY_TYPES.GEO_DISTANCE:
        this.styr= '';
      break
    }

    return str
  }
}

module.exports = FilterNode
