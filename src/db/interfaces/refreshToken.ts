import { Schema, Document } from "mongoose";

export default interface IRefreshToken extends Document {
  owner: typeof Schema.Types.ObjectId;
  token: string;
  created: number;
  expires: number;
  replacedByToken?: string;
  onModel: string;
  isExpired: () => boolean;
  isActive: () => boolean;
}
