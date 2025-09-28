"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = exports.reactionSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
exports.reactionSchema = new mongoose_1.Schema({
    reaction: { type: String, enum: Object.values(utils_1.REACTIONS), default: utils_1.REACTIONS.LIKE },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
exports.postSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: function () {
            if (!this.attachments || this.attachments.length === 0) {
                return true;
            }
            return false;
        },
        trim: true
    },
    reactions: [exports.reactionSchema],
    attachments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Attachment" }],
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });
