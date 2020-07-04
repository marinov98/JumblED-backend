import { Schema, Document } from "mongoose";

export default interface ITest extends Document {
  activation: number;
  questions: Array<typeof Schema.Types.ObjectId>;
  label: string;
  code: string;
}
