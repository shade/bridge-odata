const request = require('superagent')
const config = require('./config')
const Filter = require('./lib/filter')

class BridgeOData {

  constructor (token, vendor) {
    if (!vendor) {
      this.vendor = config.TEST_DATASET
    } else {
      this.vendor = vendor
    }

    if (!token) {
      throw new Error('Please provide a token :)')
    }

    this.endpoint = null
    this.response = null
    this.token = token
    this.query = {}
  }

  url () {
    const {vendor, endpoint, query} = this

    let url = `${config.BASE_URL}/${vendor}/${endpoint}?`

    for (let param in query) {
      base += `${param}=${query[param]}&`
    }

    return url
  }

  exec (cb) {
    const {vendor, endpoint, query, token} = this
    return new Promise((resolve, reject) => {
      request
        .get(`${config.BASE_URL}/${vendor}/${endpoint}`)
        .set('Authorization', `Bearer ${token}`)
        .query(query)
        .end((err, res) => {
          if (err) {
            this.response = null
            cb && cb(err, null)
            reject(err)
          } else {
            this.response = res.body
            cb && cb(null, res.body)
            resolve(res.body)
          }
        })
    })
  }

  // The endpoints form the OData API
  Property (key) {
    // Response reset, otherwise count(), next(), and prev() will still work.
    this.response = null
    this.endpoint = `Property${key?`(${key})`:''}`
    return this
  }
  // Alias of Property
  Properties (key) {
    return this.Property.apply(this, arguments)
  }

  Member (key) {
    // Response reset, otherwise count(), next(), and prev() will still work.
    this.response = null
    this.endpoint = `Member${key?`(${key})`:''}`
    return this
  }
  Office (key) {
    // Response reset, otherwise count(), next(), and prev() will still work.
    this.response = null
    this.endpoint = `Office${key?`(${key})`:''}`
    return this
  }
  OpenHouse (key) {
    // Response reset, otherwise count(), next(), and prev() will still work.
    this.response = null
    this.endpoint = `OpenHouse${key?`(${key})`:''}`
    return this
  }


  $skip (data, increment) {
    if (!this.query.$skip) {
      this.query.$skip = 0
    }
    if (increment) {
      this.query.$skip += data
    } else {
      this.query.$skip = data
    }

    if (this.query.$skip < 0) {
      this.query.$skip = 0
    }

    return this
  }
  $select (data) {
    // Check to see if function is called via
    // f(a,b,c,d) if so a = [a,b,c,d].
    // Leverages the next line that collapse checks it.
    if (arguments.length > 1) {
      data = arguments
    }
    this.query.$select = this._collapseCheckArray(data)
    return this
  }
  $top (data) {
    this.query.$top = data
    return this
  }
  $orderby (field, order) {
    this.query.$orderby = `${field} ${order.toLowerCase()}`
    return this
  }
  $expand (data) {
    // Check to see if function is called via
    // f(a,b,c,d) if so a = [a,b,c,d].
    // Leverages the next line that collapse checks it.
    if (arguments.length > 1) {
      data = arguments
    }
    this.query.$expand = this._collapseCheckArray(data)
    return this
  }
  $filter (data) {
    if (this.query.$filter) {
      this.query.$filter += ` and ${new Filter(data).toString()}`
    } else {
      this.query.$filter = new Filter(data).toString()
    }
    return this
  }

  count () {
    this._verifyResponse('count()')
    let { response } = this

    return response['@odata.count'] || 0
  }

  next (cb) {
    this._verifyResponse('next()')
    // If we have hit the end.
    if (this.$skip >= this.count()) {
      // TODO:  Use exec format.
      return []
    }
    this.$skip(this._bundleLength(), true)
    return this.exec(cb)
  }

  prev (cb) {
    this._verifyResponse('prev()')
    // If we have hit the beginning.
    if (this.$skip <= 0) {
      // TODO:  Use exec format.
      return cb&&cb([])

    }
    this.$skip(-this._bundleLength(), true)
    return this.exec(cb)
  }

  /** namespaced for private access */
  _verifyResponse (command) {
    if (!this.response) {
      throw new Error(`Please execute a valid query before using ${command}`)
    }
  }
  _bundleLength () {
    if (this.response.value && this.response.value.length) {
      return this.response.value.length
    }

    return config.DEFAULT_BUNDLE_LENGTH
  }

  _collapseCheckArray (data, field) {
    if (data instanceof Array) {
      return data.join(',')
    } else {
      try {
        if (typeof data === 'string') {
          return data
        } else if (data.toString() === '[object Object]') {
          throw false
        } else {
          return data.toString()
        }
      } catch (e) {
        throw new Error(`The datatype you provided for ${field} does not convert to a string...`)
      }
    }
  }

  _getFilter () {
    return this.query.$filter
  }
}


module.exports = BridgeOData
