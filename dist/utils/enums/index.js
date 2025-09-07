"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_AGENT = exports.GENDER = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "user";
    ROLE["ADMIN"] = "admin";
    ROLE["SUPER_ADMIN"] = "super_admin";
})(ROLE || (exports.ROLE = ROLE = {}));
var GENDER;
(function (GENDER) {
    GENDER["MALE"] = "male";
    GENDER["FEMALE"] = "female";
})(GENDER || (exports.GENDER = GENDER = {}));
var USER_AGENT;
(function (USER_AGENT) {
    USER_AGENT["LOCAL"] = "local";
    USER_AGENT["GOOGLE"] = "google";
})(USER_AGENT || (exports.USER_AGENT = USER_AGENT = {}));
