import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const { error } = config();

  if (error) throw error;
}

const port: number = parseInt(process.env.PORT!) || 3002;
const dbUrl: string = process.env.DB_URL || "blah";
const jwtSecret: string = process.env.SECRET || "VERYSUPERSECRETLYSECRET";
const googleSecret: string = process.env.GOOGLE_SECRET || "googleSecret";

export { port, dbUrl, jwtSecret, googleSecret };
