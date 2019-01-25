"use strict";

var _utils = require("../utils");

describe('the `parseDate` function', function () {
  it('should return a Date object if the provided date string is valid and null if it\'s invalid', function () {
    expect((0, _utils.parseDate)('01/01/2017') instanceof Date).toBe(true);
    expect((0, _utils.parseDate)('01/31/2017') instanceof Date).toBe(true);
    expect((0, _utils.parseDate)('31/01/2017') instanceof Date).toBe(false);
    expect((0, _utils.parseDate)('31/01/2017')).toEqual(null);
  });
  it('should return a Date object if the provided date object is valid and null if it\'s invalid', function () {
    expect((0, _utils.parseDate)(new Date()) instanceof Date).toBe(true);
    expect((0, _utils.parseDate)({}) instanceof Date).toBe(false);
    expect((0, _utils.parseDate)({})).toEqual(null);
  });
});