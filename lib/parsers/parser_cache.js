'use strict';

const LRU = require('lru-cache');

const parserCache = new LRU({
  max: 15000
});

function keyFromFields(type, fields, options, config) {
  let res =
    `${type}` +
    `/${typeof options.nestTables}` +
    `/${options.nestTables}` +
    `/${options.rowsAsArray}` +
    `/${options.supportBigNumbers || config.supportBigNumbers}` +
    `/${options.bigNumberStrings || config.bigNumberStrings}` +
    `/${typeof options.typeCast}` +
    `/${options.timezone || config.timezone}` +
    `/${options.decimalNumbers}` +
    `/${options.dateStrings}`;
  for (let i = 0; i < fields.length; ++i) {
    const field = fields[i];
    res += `/${field.name}:${field.columnType}:${field.flags}:${field.characterSet}`;

    if (options.nestTables) {
      res += `:${field.table}`;
    }
  }
  return res;
}

function getParser(type, fields, options, config, compiler) {
  const key = keyFromFields(type, fields, options, config);
  let parser = parserCache.get(key);

  if (parser) {
    console.log('888888888888888888888888888888888888888888888 ');
    return parser;
  }
  console.log('555555555555555555555555555555555555555555');

  parser = compiler(fields, options, config);
  parserCache.set(key, parser);
  console.log(
    '66666666666666666666666666666666666666666666666 ',
    Function.prototype.toString.call(parser)
  );
  return parser;
}

function setMaxCache(max) {
  parserCache.max = max;
}

function clearCache() {
  parserCache.reset();
}

module.exports = {
  getParser: getParser,
  setMaxCache: setMaxCache,
  clearCache: clearCache
};
