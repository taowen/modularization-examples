"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XszkPromotion = void 0;

var _entityArchetype = require("@autonomy/entity-archetype");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class XszkPromotion extends _entityArchetype.ActiveRecord {}

exports.XszkPromotion = XszkPromotion;

_defineProperty(XszkPromotion, "listActiveXszkPromotions", (0, _entityArchetype.toQuery)(XszkPromotion));