import { Schema, Document } from "mongoose";

export default interface IClass extends Document {
  title: string;
  students?: Array<typeof Schema.Types.ObjectId>;
  teacher: typeof Schema.Types.ObjectId;
}
