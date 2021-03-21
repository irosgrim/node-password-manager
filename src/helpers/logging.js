"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var LogHandler = /** @class */ (function () {
    function LogHandler() {
    }
    LogHandler.prototype.error = function (req, err) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log('URL: ', fullUrl);
        console.log('METHOD: ', req.method);
        console.log('DATE: ', new Date());
        console.log('ERROR: ', err.message);
    };
    LogHandler.prototype.info = function (req, log) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log('URL: ', fullUrl);
        console.log('METHOD: ', req.method);
        console.log('DATE: ', new Date());
        console.log('LOG: ', log);
    };
    LogHandler.prototype.text = function (log) {
        console.log(log);
    };
    return LogHandler;
}());
exports.log = new LogHandler();
