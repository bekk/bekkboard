module.exports = function parseIsoDateToJsDate (key, value) {
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i.test(value))
    return new Date(value);
  return value;
};
