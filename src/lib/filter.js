/* jshint esversion: 6 */
const acorn = require('acorn');
const {
  COMPARATOR_MAP,
  MODIFIER_MAP
} = require('./maps')

class FilterNode {
  constructor (obj) {
    // Set for ease of access to in class helper functions
    this.obj = obj

    // Set the subject values recursively.
    if (typeof obj.left === 'object') {
      let f = new FilterNode(obj.left)

      obj.left = f.isFlagged()
        ? f.toString()
        : `(${f.toString()})`
    } else {
      this.subject = obj.left
    }

    // Set the object values recursively.
    if (typeof obj.right === 'object') {
      let f = new FilterNode(obj.right)

      obj.right = f.isFlagged()
        ? f.toString()
        : `(${f.toString()})`
    } else {
      this.object = obj.right
    }

    if (obj.inner && typeof obj.inner === 'object') {
      obj.inner = new FilterNode(obj.inner).toString()
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
      ], 'Lambdas only have `variable`, `operation`, `left`, and `inner`. Please clean up the query object')

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
    this.setFlag()
  }

  _checkMakeLamdba () {
    const { operation, variable, left, inner } = this.obj

    // Grab the modification fn and construct str
    let lambda = COMPARATOR_MAP[operation]
    this.str = lambda(left, variable, inner)
  }

  _checkMakeNormal () {
    const { left, right, operation } = this.obj
    if (typeof operation === 'function') {
      let body = acorn.parse(operation).body[0]
      let names

      if (body.expression) {
        names = body.expression.params.map(param => param.name)
      } else {
        names = body.params.map(param => param.name)
      }

      // The parameters must be left or right
      if ((!names.includes('left') || !names.includes('right')) || names.length > 2) {
        throw new Error(`custom operation must only include parameters left and right ${names} is an invalid set.`)
      }
      // Either parameters are (left,right) or (right,left)
      if (names[0] === 'left') {
        this.str = operation(left, right)
      } else {
        this.str = operation(right, left)
      }
    } else {
      if (!COMPARATOR_MAP.hasOwnProperty(operation)) {
        throw new Error(`'${operation}', is not a valid operation`)
      }

      // Geodistance needs to be flagged.
      if (operation === 'distance') {
        this.setFlag()
      }

      // Create the actual query string.
      this.str = COMPARATOR_MAP[operation](left, right)
    }
  }

  setFlag () {
    this._flag = true
  }
  isFlagged () {
    return this._flag || false
  }

  toString () {
    return this.str
  }
}

module.exports = FilterNode
