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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
class AbstractRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new this.model(data);
            return yield doc.save();
        });
    }
    getOne(filter, projection, Options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter, projection, Options).exec();
        });
    }
    update(filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.updateOne(filter, data).exec();
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.deleteOne(filter).exec();
        });
    }
}
exports.AbstractRepository = AbstractRepository;
