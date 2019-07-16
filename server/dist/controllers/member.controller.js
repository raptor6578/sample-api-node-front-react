"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_jwt_1 = __importDefault(require("express-jwt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var MemberController = /** @class */ (function () {
    function MemberController() {
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    MemberController.prototype.initializeRoutes = function () {
        if (process.env.SECRET_JWT) {
            var secretJwt_1 = process.env.SECRET_JWT;
            this.router.use(express_jwt_1.default({ secret: secretJwt_1 }), function (err, req, res, next) {
                if (err.name === 'UnauthorizedError') {
                    res.status(401);
                    res.json({
                        error: 'Invalid token.',
                        status: 401
                    });
                }
                else {
                    next();
                }
            });
            this.router.use(function (req, res, next) {
                if (req.headers.authorization) {
                    var token = req.headers.authorization.split(' ')[1];
                    var decoded = jsonwebtoken_1.default.verify(token, secretJwt_1);
                    res.locals.username = decoded.username;
                }
                next();
            });
            this.router.get('/test', function (req, res) {
                res.send(res.locals.username);
            });
        }
    };
    return MemberController;
}());
exports.default = new MemberController();
