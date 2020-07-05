import { Schema, model } from "mongoose";
import IRefreshToken from "./../interfaces/refreshToken";

const RefreshTokenSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "OnModel"
  },
  token: {
    type: String,
    required: true
  },
  created: {
    type: Number,
    default: Date.now()
  },
  expires: {
    type: Number,
    required: true
  },
  replacedByToken: {
    type: String,
    required: true
  }
});

RefreshTokenSchema.methods.isExpired = function (this: IRefreshToken): boolean {
  return Date.now() >= this.expires;
};

RefreshTokenSchema.methods.isActive = function (this: IRefreshToken): boolean {
  return !this.isExpired();
};

export default model<IRefreshToken>("RefreshToken", RefreshTokenSchema);
