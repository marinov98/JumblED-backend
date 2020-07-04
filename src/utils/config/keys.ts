import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const { error } = config();

  if (error) throw error;
}

const port: number = parseInt(process.env.PORT!) || 3002;
const dbUrl: string =
  process.env.DB_URL || "mongodb://localhost:27017/jumbledTest";
const jwtSecret: string = process.env.SECRET || "VERYSUPERSECRETLYSECRET";
const refreshSecret: string = process.env.REFRESH_SECRET || "REFRESHingSecret";
const googleSecret: string = process.env.GOOGLE_SECRET || "googleSecret";
const googleClientId: string = process.env.GOOGLE_CLIENT_ID || "googleClientId";

export { port, dbUrl, jwtSecret, refreshSecret, googleSecret, googleClientId };
