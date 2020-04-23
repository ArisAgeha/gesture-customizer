"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArray = isArray;

function isArray(array) {
  if (Array.isArray) {
    return Array.isArray(array);
  }

  if (array && typeof array.length === 'number' && array.constructor === Array) {
    return true;
  }

  return false;
}