"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskGateway = void 0;

var _entityArchetype = require("@autonomy/entity-archetype");

class TaskGateway extends _entityArchetype.Gateway {
  static async wasteSomeResource() {
    const mills = Math.random() * 5000;

    if (mills < 1000) {
      throw new Error('bad luck');
    }

    await new Promise(resolve => setTimeout(resolve, mills));
    return mills;
  }

}

exports.TaskGateway = TaskGateway;