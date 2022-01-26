"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPIUrl = void 0;
var forta_agent_1 = require("forta-agent");
var axios_1 = __importDefault(require("axios"));
var INTERESTING_PROTOCOLS = [
    "0x11111112542d85b3ef69ae05771c2dccff4faa26",
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f",
    "0xe592427a0aece92de3edee1f18e0157c05861564",
    "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
    "0x881D40237659C251811CEC9c364ef91dC08D300C",
    "0xA58f22e0766B3764376c92915BA545d583c19DBc",
    "0x9008D19f58AAbD9eD0D60971565AA8510560ab41" // Gnosis Protocol
];
var API_ENDPOINT = "https://blocks.flashbots.net/v1/blocks?block_number=";
var getAPIUrl = function (block) { return "".concat(API_ENDPOINT).concat(block); };
exports.getAPIUrl = getAPIUrl;
var provideHandleTransaction = function (getter, protocols) {
    return function (txEvent) { return __awaiter(void 0, void 0, void 0, function () {
        var findings, protocolsInUse, data, currentTxn, txn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findings = [];
                    protocolsInUse = protocols.filter(function (p) { return txEvent.addresses[p.toLowerCase()]; });
                    if (protocolsInUse.length === 0)
                        return [2 /*return*/, findings];
                    return [4 /*yield*/, getter((0, exports.getAPIUrl)(txEvent.blockNumber))];
                case 1:
                    data = (_a.sent()).data;
                    // check if the block has a bundle
                    if (data.blocks.length === 0)
                        return [2 /*return*/, findings];
                    currentTxn = data.blocks[0].transactions.filter(function (txn) { return txn.transaction_hash === txEvent.hash; });
                    if (currentTxn.length === 0)
                        return [2 /*return*/, findings];
                    txn = currentTxn[0];
                    // report findings
                    protocolsInUse.forEach(function (p) {
                        findings.push(forta_agent_1.Finding.fromObject({
                            name: "MEV Tracker - Protocol Interaction Detection",
                            description: "A protocol used inside MEV bundle",
                            alertId: "NETHFORTA-11",
                            type: forta_agent_1.FindingType.Suspicious,
                            severity: forta_agent_1.FindingSeverity.Info,
                            metadata: {
                                protocol: p,
                                bundle_type: txn.bundle_type,
                                hash: txEvent.hash
                            }
                        }));
                    });
                    return [2 /*return*/, findings];
            }
        });
    }); };
};
exports.default = {
    provideHandleTransaction: provideHandleTransaction,
    handleTransaction: provideHandleTransaction(axios_1.default.get, INTERESTING_PROTOCOLS)
};
