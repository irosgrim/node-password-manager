"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertNewSecret = exports.getSecretWithId = void 0;
exports.getSecretWithId = "SELECT * FROM wallet where id=$1 AND user_id=$2";
exports.insertNewSecret = "INSERT INTO wallet (label, secret, user_id) VALUES ($1, $2, $3)";
