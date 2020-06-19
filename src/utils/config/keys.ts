import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const { error } = config();

  if (error) throw error;
}

const port = process.env.PORT || 3002;
const db_url = process.env.DB_URL || "blah";

export { port, db_url };
