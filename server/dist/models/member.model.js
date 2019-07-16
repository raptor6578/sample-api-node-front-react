"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var memberSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
memberSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || user.isNew) {
        bcrypt_1.default.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt_1.default.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        return next();
    }
});
memberSchema.methods.comparePassword = function (pw, cb) {
    var user = this;
    bcrypt_1.default.compare(pw, user.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
exports.default = mongoose_1.default.model('Member', memberSchema);
