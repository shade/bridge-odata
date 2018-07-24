/* jshint esversion: 6 */
const {
  COMPARATOR_MAP,
  MODIFIER_MAP
} = require('./maps')

const QUERY_TYPES = {
  NORMAL: 0x00,
  LAMBDA: 0x01,
  MODIFIER: 0x02,
  GEO_DISTANCE: 0x03,
  EXPRESSION: 0x04
}

class FilterNode {
  constructor (obj) {
    // Set for ease of access to in class helper functions
    this.obj = obj
    this.type = null

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
  }

  _checkMakeLamdba () {
    const { operation, left, right } = this.obj

    // Grab the modification fn and construct str
    let lambda = MODIFIER_MAP[modifier]
    this.str = lambda(left, variable, right)
  }

  _checkMakeNormal () {
    const { left, right, operation } = this.obj

    if (!COMPARATOR_MAP.hasOwnProperty(operation)) {
      throw new Error(`'${operation}', is not a valid operation`)
    }
    // Create the actual query string.
    this.str = COMPARATOR_MAP[operation](left, right)
  }

  toString () {
    let str = this.str || ''

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
        this.str= '';
      break
      case QUERY_TYPES.EXPRESSION:
      break
    }

    return str
  }
}

module.exports = FilterNode
