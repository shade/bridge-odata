
const COMPARATOR_MAP = {
  // General logical operations
  'neq': (subject, object) => `${subject} neq ${object}`,
  'eq': (subject, object) => `${subject} eq ${object}`,
  'lt': (subject, object) => `${subject} lt ${object}`,
  'le': (subject, object) => `${subject} le ${object}`,
  'gt': (subject, object) => `${subject} gt ${object}`,
  'ge': (subject, object) => `${subject} ge ${object}`,

  // Clause operations
  'and': (subject, object) => `${subject} and ${object}`,
  'or': (subject, object) => `${subject} or ${object}`,

  // String operations
  'startswith': (subject,object) => `startswith(${subject},${object})`,
  'endswith': (subject,object) => `endswith(${subject},${object})`,

  // Geo / Distance operationss
  'distance': (subject,object,op,c) => `geo.distance(${subject},${object}) ${op} ${c}`,
  'intersect': (subject,object) => `geo.intersect(${subject},${object})`,

  // Lambda operations
  'any': (subject, variable, inner) => `${subject}/any(${variable}: ${inner})`,
  'all': (subject, variable, inner) => `${subject}/all(${variable}: ${inner})`
}

const MODIFIER_MAP = {
  // Datetime modifier
  time: s => `time(${s})`,
  year: s => `year(${s})`,
  month: s => `month(${s})`,
  day: s => `day(${s})`,
  hour: s => `hour(${s})`,
  min: s => `minute(${s})`,
  sec: s => `second(${s})`,
  // String modifiers
  toupper: s => `toupper(${s})`,
  tolower: s => `tolower(${s})`
}


module.exports = {
  COMPARATOR_MAP,
  MODIFIER_MAP
}
