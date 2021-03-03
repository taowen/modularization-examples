"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GreetingWordsGateway = void 0;

var _entityArchetype = require("@autonomy/io");

class GreetingWordsGateway extends _entityArchetype.Gateway {
  async getGreetingWords(scene) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'hello';
  }

}

exports.GreetingWordsGateway = GreetingWordsGateway;