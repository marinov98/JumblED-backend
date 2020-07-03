import { Schema, Document } from "mongoose";

export default interface IQuestion extends Document {
  prompt?: string;
  image?: string; // this will be probably be changed later
  choices?: Array<string>;
  text?: string;
  time: number;
  test: typeof Schema.Types.ObjectId;
}
