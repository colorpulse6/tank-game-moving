"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blueTankTexture = exports.greenTankTexture = exports.redTankTexture = exports.wallTexture = exports.hayTexture = exports.bulletTexture = exports.bgTexture = void 0;
var PIXI = __importStar(require("pixi.js"));
exports.bgTexture = PIXI.Texture.from("/assets/bg.png");
exports.bulletTexture = PIXI.Texture.from("/assets/bullet.png");
exports.hayTexture = PIXI.Texture.from("/assets/hay.png");
exports.wallTexture = PIXI.Texture.from("/assets/brickwall.png");
exports.redTankTexture = PIXI.Texture.from("/assets/tank-red.png");
exports.greenTankTexture = PIXI.Texture.from("/assets/tank-green.png");
exports.blueTankTexture = PIXI.Texture.from("/assets/tank-blue.png");
