"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var forta_agent_1 = require("forta-agent");
var axios_1 = __importDefault(require("axios"));
var agent_1 = __importStar(require("./agent"));
// transaction in a bundle
var txnInBundle = {
    hash: "0x14e3ef169d0bb84683d0a9ba75f45d38526f3a199e97f94e6c2fe4287e260d2d",
    to: "0xcC3938DCc005EacF98Fa53AD05BF861ca2fD485e".toLowerCase(),
    bundle_type: "flashbots",
    number: 13055778
};
var PROTOCOLS = ["0x1", "0x2", "0x3"];
var createTxEvent = function (_a, extra_addresses) {
    var _b;
    var hash = _a.hash, to = _a.to, number = _a.number;
    if (extra_addresses === void 0) { extra_addresses = {}; }
    var tx = { hash: hash, to: to };
    var receipt = {};
    var block = { number: number };
    var addresses = __assign((_b = {}, _b[to] = true, _b), extra_addresses);
    return new forta_agent_1.TransactionEvent(forta_agent_1.EventType.BLOCK, forta_agent_1.Network.MAINNET, tx, receipt, [], addresses, block);
};
describe("MEV-tracker agent test suit", function () {
    describe("handleTransaction", function () {
        it("Should query the API and found the transaction", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleTransaction, txn, findings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleTransaction = agent_1.default.provideHandleTransaction(axios_1.default.get, [txnInBundle.to]);
                        txn = createTxEvent(txnInBundle);
                        return [4 /*yield*/, handleTransaction(txn)];
                    case 1:
                        findings = _a.sent();
                        expect(findings).toStrictEqual([
                            forta_agent_1.Finding.fromObject({
                                name: "MEV Tracker - Protocol Interaction Detection",
                                description: "A protocol used inside MEV bundle",
                                alertId: "NETHFORTA-11",
                                type: forta_agent_1.FindingType.Suspicious,
                                severity: forta_agent_1.FindingSeverity.Info,
                                metadata: {
                                    protocol: txnInBundle.to,
                                    bundle_type: txnInBundle.bundle_type,
                                    hash: txnInBundle.hash
                                }
                            })
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe("Mocking the API", function () {
            var mockGet = jest.fn();
            var handleTransaction = agent_1.default.provideHandleTransaction(mockGet, PROTOCOLS);
            beforeEach(function () {
                mockGet.mockClear();
            });
            it("Should report 0 findings if the block has no bundle", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txn, findings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockGet.mockReturnValueOnce({
                                data: {
                                    blocks: []
                                }
                            });
                            txn = createTxEvent({
                                hash: "0xH1",
                                number: 1,
                                to: "0x1"
                            });
                            return [4 /*yield*/, handleTransaction(txn)];
                        case 1:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([]);
                            expect(mockGet).toHaveBeenCalledTimes(1);
                            expect(mockGet).toHaveBeenCalledWith((0, agent_1.getAPIUrl)(1));
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should report 0 findings if the transaction is not inside the bundle", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txn, findings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockGet.mockReturnValueOnce({
                                data: {
                                    blocks: [
                                        {
                                            transactions: [
                                                {
                                                    transaction_hash: "0xH1"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            });
                            txn = createTxEvent({
                                hash: "0xH2",
                                number: 2,
                                to: "0x2"
                            });
                            return [4 /*yield*/, handleTransaction(txn)];
                        case 1:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([]);
                            expect(mockGet).toHaveBeenCalledTimes(1);
                            expect(mockGet).toHaveBeenCalledWith((0, agent_1.getAPIUrl)(2));
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should ignore transaction without protocols of interest", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txn, findings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            txn = createTxEvent({
                                hash: "0xH20",
                                number: 20,
                                to: "0x20"
                            });
                            return [4 /*yield*/, handleTransaction(txn)];
                        case 1:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([]);
                            expect(mockGet).toHaveBeenCalledTimes(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should report all the protocols used inside the bundled transaction", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txn, findings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockGet.mockReturnValueOnce({
                                data: {
                                    blocks: [
                                        {
                                            transactions: [
                                                {
                                                    transaction_hash: "0xH3",
                                                    bundle_type: "nethermind-flasbots"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            });
                            txn = createTxEvent({
                                hash: "0xH3",
                                number: 3,
                                to: "0x3"
                            }, { "0x1": true });
                            return [4 /*yield*/, handleTransaction(txn)];
                        case 1:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([
                                forta_agent_1.Finding.fromObject({
                                    name: "MEV Tracker - Protocol Interaction Detection",
                                    description: "A protocol used inside MEV bundle",
                                    alertId: "NETHFORTA-11",
                                    type: forta_agent_1.FindingType.Suspicious,
                                    severity: forta_agent_1.FindingSeverity.Info,
                                    metadata: {
                                        protocol: "0x1",
                                        bundle_type: "nethermind-flasbots",
                                        hash: "0xH3"
                                    }
                                }),
                                forta_agent_1.Finding.fromObject({
                                    name: "MEV Tracker - Protocol Interaction Detection",
                                    description: "A protocol used inside MEV bundle",
                                    alertId: "NETHFORTA-11",
                                    type: forta_agent_1.FindingType.Suspicious,
                                    severity: forta_agent_1.FindingSeverity.Info,
                                    metadata: {
                                        protocol: "0x3",
                                        bundle_type: "nethermind-flasbots",
                                        hash: "0xH3"
                                    }
                                })
                            ]);
                            expect(mockGet).toHaveBeenCalledTimes(1);
                            expect(mockGet).toHaveBeenCalledWith((0, agent_1.getAPIUrl)(3));
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
