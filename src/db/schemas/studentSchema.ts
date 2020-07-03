import { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  classes?: Array<typeof Schema.Types.ObjectId>;
}

const StudentSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }]
});

// Handling passwords
StudentSchema.pre("save", async function (
  this: IStudent,
  next: Function
): Promise<void> {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (err) {
    console.error(err);
  }
});

StudentSchema.methods.comparePassword = async function (
  this: IStudent,
  otherPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(otherPassword, this.password);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default model<IStudent>("Student", StudentSchema);
