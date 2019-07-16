"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var member_model_1 = __importDefault(require("../models/member.model"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dist_1 = require("express-recaptcha/dist");
var AuthController = /** @class */ (function () {
    function AuthController() {
        this.router = express_1.default.Router();
        // @ts-ignore
        this.recaptcha = new dist_1.RecaptchaV2(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_PRIVATE_KEY);
        this.initializeRoutes();
    }
    AuthController.prototype.initializeRoutes = function () {
        this.router.post('/register', this.recaptcha.middleware.verify, function (req, res) {
            if (req.body.username && req.body.password && req.recaptcha) {
                if (!req.recaptcha.error) {
                    member_model_1.default.findOne({ username: req.body.username }).then(function (result) {
                        if (!result) {
                            var member = new member_model_1.default();
                            member.username = req.body.username;
                            member.password = req.body.password;
                            member.save()
                                .then(function () {
                                res.status(201);
                                res.json({
                                    message: 'Successful registration.',
                                    statusCode: 201
                                });
                            })
                                .catch(function (error) {
                                console.log(error);
                            });
                        }
                        else {
                            res.status(409);
                            res.json({
                                error: 'Username already exists.',
                                errorCode: 3,
                                statusCode: 409
                            });
                        }
                    });
                }
                else {
                    res.status(409);
                    res.json({
                        error: req.recaptcha.error,
                        errorCode: 2,
                        statusCode: 409
                    });
                }
            }
            else {
                res.status(409);
                res.json({
                    error: 'Username and password required.',
                    errorCode: 1,
                    statusCode: 409
                });
            }
        });
        this.router.post('/login', function (req, res) {
            if (req.body.username && req.body.password) {
                member_model_1.default.findOne({ username: req.body.username })
                    .then(function (username) {
                    if (username) {
                        username.comparePassword(req.body.password, function (err, isMatch) {
                            if (isMatch && !err) {
                                // @ts-ignore
                                var token = jsonwebtoken_1.default.sign(username.toJSON(), process.env.SECRET_JWT);
                                res.status(200);
                                res.json({
                                    token: token,
                                    statusCode: 200
                                });
                            }
                            else {
                                res.status(401);
                                res.json({
                                    error: 'Bad password.',
                                    errorCode: 3,
                                    statusCode: 401
                                });
                            }
                        });
                    }
                    else {
                        res.status(401);
                        res.json({
                            error: 'Username not found.',
                            errorCode: 2,
                            statusCode: 401
                        });
                    }
                })
                    .catch(function (error) {
                    console.log(error);
                });
            }
            else {
                res.status(401);
                res.json({
                    error: 'Username and password required.',
                    errorCode: 1,
                    statusCode: 401
                });
            }
        });
    };
    return AuthController;
}());
exports.default = new AuthController();
