"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var Cryptography = /** @class */ (function () {
    function Cryptography() {
        this.algorithm = 'aes-256-ctr';
        this.secretKey = process.env.CRYPTO_SECRET_KEY;
        this.iv = crypto_1.default.randomBytes(16);
    }
    Cryptography.prototype.encrypt = function (text) {
        var cipher = crypto_1.default.createCipheriv(this.algorithm, this.secretKey, this.iv);
        var encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return this.iv.toString('hex') + '_' + encrypted.toString('hex');
    };
    Cryptography.prototype.decrypt = function (hash) {
        var encryptedHash = hash.split('_');
        var iv = encryptedHash[0];
        var content = encryptedHash[1];
        var decipher = crypto_1.default.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(iv, 'hex'));
        var decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
        return JSON.parse(decrypted.toString());
    };
    return Cryptography;
}());
exports.default = Cryptography;
