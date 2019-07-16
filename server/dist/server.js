"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var colors_1 = __importDefault(require("colors"));
var auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
var member_controller_1 = __importDefault(require("./controllers/member.controller"));
if (process.env.MONGO_HOST && process.env.SECRET_JWT && process.env.EXPRESS_PORT) {
    var mongoHost = process.env.MONGO_HOST;
    var expressPort = process.env.EXPRESS_PORT;
    mongoose_1.default.connect(mongoHost, { useNewUrlParser: true, useCreateIndex: true });
    var app = express_1.default();
    app.listen(expressPort);
    console.log(colors_1.default.yellow("Your backend api listens on port " + expressPort + "."));
    app.use(body_parser_1.default.json());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
        next();
    });
    app.use('/auth', auth_controller_1.default.router);
    app.use('/member', member_controller_1.default.router);
    app.use(express_1.default.static(path_1.default.resolve('build')));
    app.get('*', function (req, res) {
        res.sendFile(path_1.default.resolve('build/index.html'));
    });
}
else {
    console.log(colors_1.default.red('You must configure your environment variables in the .env file.'));
}
