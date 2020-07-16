import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const { error } = config();

  if (error) throw error;
}

const port: number = parseInt(process.env.PORT!) || 3002;
const dbUrl: string =
  process.env.DB_URL || "mongodb://localhost:27017/jumbledTest";
const jwtSecret: string = process.env.SECRET || "VERYSUPERSECRETLYSECRET";
const issuer: string = process.env.ISSUER || "JumblED";
const audience: string = process.env.AUDIENCE || "Jumbled Users";

export { port, dbUrl, jwtSecret, issuer, audience };
