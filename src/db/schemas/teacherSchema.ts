import { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface ITeacher extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  classes?: Array<typeof Schema.Types.ObjectId>;
  tests?: Array<typeof Schema.Types.ObjectId>;
}

const TeacherSchema: Schema = new Schema({
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
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
  tests: [{ type: Schema.Types.ObjectId, ref: "Test" }]
});

// Handling passwords
TeacherSchema.pre("save", async function (
  this: ITeacher,
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

TeacherSchema.methods.comparePassword = async function (
  this: ITeacher,
  otherPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(otherPassword, this.password);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default model<ITeacher>("Teacher", TeacherSchema);
