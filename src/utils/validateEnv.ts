import { cleanEnv, str, port } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

export default function validateEnv() {
  cleanEnv(process.env, {
    MONGO_DB_URI: str(),
    PORT: port(),
  });
}
