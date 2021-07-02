import { cleanEnv, str, port } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

export default function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    MONGO_DB_URI: str(),
    PORT: port(),
  });
}
