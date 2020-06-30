import * as mongoose from "mongoose";
import { dbUrl } from "./../config/keys";

export default async function connectToDatabase() {
  try {
    await mongoose.connect(dbUrl, { useNewUrlParser: true });
    console.log(`Database connected to ${dbUrl}`);
  } catch (err) {
    console.error(err);
  }
}
