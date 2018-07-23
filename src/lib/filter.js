/* jshint esversion: 6 */
const {
  COMPARATOR_MAP
} = require('./maps')

class FilterNode {
  constructor (obj) {
    const { left, comparator, right, variable, expr } = obj

    if (expression) {
      this.str = expr
      return
    }

    // If this is a lambda, must have a variable
    _checkVerifyLambda(obj, keys)
    // Make sure proper params are set
    _checkVerifyExpression(obj, keys)

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

  _checkVerifyLambda (obj, keys) {
    if (obj.comparator === 'any' || obj.comparator === 'all') {
      if (!obj.variable) {
        throw new Error('Lambda expressions (any, all), must specify a variable')
      }
    }
  }

  _checkVerifyExpression (obj, keys) {
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
    const {expression, subject, comparator, object} = this
    return this.str
  }
}

module.exports = FilterNode
