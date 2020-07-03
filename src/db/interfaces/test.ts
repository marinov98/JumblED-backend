import { Schema, Document } from "mongoose";

export default interface ITest extends Document {
  activation: Date;
  questions: Array<typeof Schema.Types.ObjectId>;
  label: string;
}
