"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XszkPromotion = void 0;

var _io = require("@autonomy/io");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class XszkPromotion extends _io.ActiveRecord {}

exports.XszkPromotion = XszkPromotion;

_defineProperty(XszkPromotion, "listActiveXszkPromotions", (0, _io.toQuery)(XszkPromotion));