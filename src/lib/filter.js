/* jshint esversion: 6 */
const acorn = require('acorn');
const {
  COMPARATOR_MAP,
  MODIFIER_MAP
} = require('./maps')

// None of these are allowed to be 0, ever.
const FLAGS = {
  MODIFIER: 0x01
}

class FilterNode {
  constructor (obj) {
    // Set for ease of access to in class helper functions
    this.obj = obj

    // Set the subject values recursively.
    if (typeof obj.left === 'object') {
      let f = new FilterNode(obj.left).toString()

      obj.left = (f.flag() === FLAGS.MODIFIER)
        ? f
        : `(${f})`
    } else {
      this.subject = obj.left
    }

    // Set the object values recursively.
    if (typeof obj.right === 'object') {
      let f = new FilterNode(obj.right).toString()

      obj.right = (f.flag() === FLAGS.MODIFIER)
        ? f
        : `(${f})`
    } else {
      this.object = obj.right
    }

    // Check if it's an expression
    if (obj.expr) {
      this._checkVars(['expr'], 'You added `expr`, remove other attributes, or remove `expr`')
      this.str = obj.expr
      return
    }

    // Check if it's a modifier
    if (obj.modifier) {
      this._checkVars(['modifier', 'value'], 'Using a modifier must only have `modifier` and `value`')
      this._checkMakeModifer()
      return
    }

    // Check if it's lambda
    if (['any','all'].includes(obj.operation)) {
      this._checkVars([
        'variable',
        'left',
        'inner',
        'operation'
      ], 'Lambdas only have `variable`, `operation`, `left`, and `right`. Please clean up the query object')

      this._checkMakeLamdba()
      return
    }

    // Because this hasn't been returned yet, it must be normal.
    this._checkVars(['left', 'right', 'operation'], 'Your query is expressed invalidly, please check the README for more details.')
    this._checkMakeNormal()
  }

  /**
   * Checks to see if there are attributes not in attr that are in obj. Throws if that is the case.
   *
   * @param {Array.<string>} attrs - Array of valid attributes
   * @param {string} msg - A string message to throw if this fails
   */
  _checkVars (attrs, msg) {
    let obj = this.obj

    for (var key in obj) {
      if (!attrs.includes(key)) {
        throw new Error(msg)
      }
    }
  }

  /**
   * Constructs a modifier style string from this.obj
   */
  _checkMakeModifer () {
    const { modifier, value } = this.obj

    if (!MODIFIER_MAP.hasOwnProperty(modifier)) {
      throw new Error(`'${modifier}', is not a valid modifier`)
    }

    // Grab the modification fn and construct str
    let mod = MODIFIER_MAP[modifier]
    this.str = mod(value)
    // Flag so that the upper level knows.
    this.flag(FLAGS.MODIFIER)
  }

  _checkMakeLamdba () {
    const { operation, left, right } = this.obj

    // Grab the modification fn and construct str
    let lambda = COMPARATOR_MAP[operation]
    this.str = lambda(left, variable, right)
  }

  _checkMakeNormal () {
    const { left, right, operation } = this.obj

    if (!COMPARATOR_MAP.hasOwnProperty(operation)) {
      throw new Error(`'${operation}', is not a valid operation`)
    }
    if (typeof operation === 'function') {
      acorn.parse(operation);
    } else {
      // Create the actual query string.
      this.str = COMPARATOR_MAP[operation](left, right)
    }
  }

  flag (flag) {
    if (!flag) {
      this.flag = flag
    } else {
      return flag
    }
  }

  toString () {
    return this.str
  }
}

module.exports = FilterNode
