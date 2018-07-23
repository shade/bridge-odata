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

## API
### new BridgeAPI(token, [vendor])
Returns a new instance of BridgeAPI. Requires an API token and optionally set the vendor (the MLS data source), defaults to `test`.

## bridge.Property([ListingKey])
## bridge.Member([MemberKey])
## bridge.Office([OfficeKey])
## bridge.OpenHouse([OpenHouseKey])
Returns a single entity if a key is specified. If a key is not specified all related entities are returned.

## bridge.Media()
Returns all media.

## bridge.count()
The number of results from the most recent query, set to 0 before and during query execution.

## bridge.next()
Paginates to the next page of results.

## bridge.prev()
Paginates to the previous page of results.


## Example
A simple example of an autocomplete can be seen here,
The SDK part of the code looks like:

```js
  var BridgeAPI = require('./odata-js-sdk')

  const Bridge = new BridgeAPI(BridgeAPI.TEST_TOKEN)

  function autocomplete (address) {
    let prim = Bridge.Properties()
      .$select('','')
      .$filter({
        left: 'UnparsedAddress',
        comparator: 'startswith',
        right: address
      })
      .exec()

    return prim
  }
```


## bridge.$filter(query)

```js
{right: 'a', op: 'eq', left: 'b'} => 'a eq b'
{right: 'a', op: 'intersect', left: 'b'} => 'geo.intersect(a,b)'
```
The full list of operations can be found in the `src/lib/maps.js' file, but are not limited to:


|Name|Map|
|--|--|
|eq| 'a eq b' |
|neq| 'a neq b' |
|lt| 'a lt b' |
|gt| 'a gt b' |
|ge| 'a ge b' |
