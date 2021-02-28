"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GreetingWordsGateway = void 0;

var _entityArchetype = require("@autonomy-design-sample/entity-archetype");

class GreetingWordsGateway extends _entityArchetype.Gateway {
  async getGreetingWords(scene) {
    return 'hello';
  }

}

exports.GreetingWordsGateway = GreetingWordsGateway;