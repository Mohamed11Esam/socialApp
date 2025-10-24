import { Schema } from "mongoose";
import { IUser } from "./../../../utils/interfaces/index";
import { USER_AGENT, GENDER, ROLE } from "../../../utils/enums";
import { sendMail } from "../../../utils";
import { error } from "console";

export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    email: { type: String, required: true, unique: true, trim: true },
    password: {
      type: String,
      required: function () {
        if (this.userAgent == USER_AGENT.GOOGLE) {
          return false;
        }
        return true;
      },
      trim: true,
    },
    credentialUpdatedAt: { type: Date, default: Date.now },
    phone: { type: String },
    role: { type: String, enum: Object.values(ROLE), default: ROLE.USER },
    gender: { type: String, enum: Object.values(GENDER), default: GENDER.MALE },
    userAgent: {
      type: String,
      enum: Object.values(USER_AGENT),
      default: USER_AGENT.LOCAL,
    },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    accessToken: { type: String },
    refreshToken: { type: String },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema
  .virtual("fullName")
  .get(function () {
    return `${this.firstName as string} ${this.lastName as string}`;
  })
  .set(function (this: IUser, fullName: string) {
    const [firstName, lastName] = fullName.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  });

userSchema.pre("save", async function (next) {
  if (this.email && this.userAgent === USER_AGENT.LOCAL && !this.isVerified) {
    await sendMail({
      to: this.email,
      subject: "Verification Email",
      html: `<p>Your verification code is: <strong>${this.otp}</strong></p>`,
    });
  }
});
