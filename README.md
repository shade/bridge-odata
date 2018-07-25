# OData JS SDK

## Installation
```bash
 npm install restly/odata-js-sdk
```
## Usage
```js
  var bridge = require('odata-js-sdk')
  // Vendor defaults to `test`
  var bridge = new BridgeAPI(ACCESS_TOKEN, [vendor])

  // Fetches a list of Properties, provided by the vendor
  bridge
    .Properties()
    .exec()
```


## Demo
A simple demo of an autocomplete can be seen here,
The SDK part of the code looks like:

```js
  var BridgeAPI = require('./odata-js-sdk')

  const Bridge = new BridgeAPI(BridgeAPI.TEST_TOKEN)

  /**
   * @param {string} address - The beginning of an address e.g. `1120 Mi`
   * @returns {Promise} - resolves if the API request is successful.
   */
  function autocomplete (address) {
    let prim = Bridge.Properties()
      .$select('','')
      .$filter({
        left: {
          left: 'UnparsedAddress',
          comparator: 'neq',
          right: 'null'
        },
        comparator: 'and',
        right: {
          left: 'UnparsedAddress',
          comparator: 'startswith',
          right: `'${address}'` // Note: string quotes are not auto inferred.
        }
      })
      .exec()

    return prim
  }
```


## API
### new BridgeAPI(token, [vendor])
Returns a new instance of BridgeAPI. Requires an API token and optionally set the vendor (the MLS data source), defaults to `test`.

### bridge.Property([ListingKey])
Returns a single property if a ListingKey is specified. Otherwise will return a list of properties that fulfill the criteria. This function has an alias: `bridge.Properties`

### bridge.Member([MemberKey])
### bridge.Office([OfficeKey])
### bridge.OpenHouse([OpenHouseKey])
Returns a single entity if a key is specified. If a key is not specified all related entities are returned.



### bridge.Media()
Returns all media.

### bridge.count()
The number of results from the most recent query, set to 0 before and during query execution.

### bridge.next()
Paginates to the next page of results.

### bridge.prev()
Paginates to the previous page of results.

### bridge.exec([cb])
Executes the API query, will return a Promise if no callback is specified, otherwise, calls a the callback `cb(err, resp)`

## OData Specific Params

### bridge.$skip(n)
  Skips the first n items.
### bridge.$select(attributes)
  Select items that have the following specific attributes, accepts an array of attributes or a comma seperated string. e.g.
  ```js
    bridge.$select('StandardStatus,UnparsedAddress')
    // Is the same as:
    bridge.$select(['StandardStatus','UnparsedAddress'])
  ```
### bridge.$top(n)
  Only returns the top n items.
### bridge.$orderby(str)
  Skips the first n items.
### bridge.$expand(attribute)
  Expands the provided attribute, also accepts an array or comma seperated string of attributes.

## bridge.$filter(query)

Filtered queries can get complex however they are fairly powerful. One can write a JS object literal as the query that will map to a string query. e.g.

```js
{right: 'a', op: 'eq', left: 'b'} => 'a eq b'
{right: 'a', op: 'intersect', left: 'b'} => 'geo.intersect(a,b)'
```

### Hardcoded operations
The full list of operations can be found in the `src/lib/maps.js' file, but are not limited to:

|Name | Operation | Description |
|--|--|--|
|eq| 'a eq b' | checks if a == b |
|neq| 'a neq b' | checks if a != b |
|lt| 'a lt b' | checks if a < b |
|gt| 'a gt b' | checks if a > b |
|ge| 'a ge b' | checks if a >= b |
|le| 'a le b' | checks if a <= b |
|and| | |
|or| | |
|startswith| | |
|endswith| | |
|contains| | |
|distance| | |
|intersect| | |
|any| | |
|all| | |

#### Modifiers
Modifiers modify a specific response field. The full list of modifiers can be found in the `src/lib/maps.js' file, but are not limited to:

|Name | Operation | Description |
| -- | -- | -- |
|time| 'time(a)' | Grabs the time of the response date field |
|year| 'year(a)' | Grabs the year of the response date field |
|month| 'month(a)' | Grabs the month of the response date field |
|day| 'day(a)' | Grabs the day of the response date field |
|hour| 'hour(a)' | Grabs the hour of the response date field |
|min| 'min(a)' | Grabs the min of the response date field |
|sec| 'sec(a)' | Grabs the sec of the response date field |
|upper| 'upper(a)' | Grabs the upper of the response date field |
|lower| 'lower(a)' | Grabs the lower of the response date field |

#### Lambdas
The `any` and `all` operations are referred to and act as lambdas in the OData syntax.


### Custom operations (unsafe)
In the event that one is aware of an operation that currently doesn't exist within the set of hardcoded operations they can create their own. With this syntax the object literal attributes must have the same name as the operation function parameters.

#### Example of a valid custom query
```js
// Valid!
{
  right: 'Joe',
  left: '"The greatest person ever"',
  op: (right, left) => `${right} eq ${left}`
} => 'Joe eq "The greatest person ever"'

```

#### Example of an invalid custom query
```js
// Invalid! Will throw error
{
  right: 'Joe',
  left: '"The greatest person ever"',
  op: (a,b) => `${a} eq ${b}`
} => ERROR
```
