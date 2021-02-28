"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XszkPromotionGateway = void 0;

var _entityArchetype = require("@autonomy/entity-archetype");

var _XszkPromotion = require("./XszkPromotion");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class XszkPromotionGateway extends _entityArchetype.Gateway {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "listActiveXszkPromotions", (0, _entityArchetype.toQuery)(_XszkPromotion.XszkPromotion));
  }

}

exports.XszkPromotionGateway = XszkPromotionGateway;