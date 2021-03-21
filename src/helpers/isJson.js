"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringIsJson = void 0;
function stringIsJson(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.stringIsJson = stringIsJson;
