"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskGateway = void 0;

var _io = require("@autonomy/io");

class TaskGateway extends _io.Gateway {
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