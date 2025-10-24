import { Schema } from "mongoose";
import { IPost } from "../../../utils/interfaces";
import { reactionSchema } from "../common";



export const postSchema = new Schema<IPost>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: function () {
        if (!this.attachments || this.attachments.length === 0) {
            return true;
        }
        return false;
    },
    trim: true
},
    reactions: [reactionSchema],
    attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
    isFrozen: { type: Boolean, default: false },
},{ timestamps: true  , toJSON: { virtuals: true }, toObject: { virtuals: true }});

postSchema.virtual('comments', {
    localField: '_id',
    foreignField: 'postId',
    ref: 'Comment'
});

postSchema.pre('deleteOne' , async function(next){
    const ctx:any = this;
    const filter = typeof ctx.getFilter === 'function' ? ctx.getFilter() : ctx._conditions;
    // const firstLayerOfComments = await ctx.model.db.model('Comment').find({ postId: filter._id, parentId: null });
    // if(firstLayerOfComments.length){
    //     for(const comment of firstLayerOfComments){
    //         await ctx.model.db.model('Comment').deleteOne({ parentId: comment._id });
    //     }
    // }
    // next();
    await ctx.model.db.model('Comment').deleteMany({ postId: filter._id });
    next();
});