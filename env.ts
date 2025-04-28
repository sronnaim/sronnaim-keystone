import "dotenv/config";

function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const ENV = {
  NODE_ENV: getEnvVar("NODE_ENV"),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  SESSION_SECRET: getEnvVar("SESSION_SECRET"),
  CLOUDINARY_CLOUD_NAME: getEnvVar("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_KEY: getEnvVar("CLOUDINARY_KEY"),
  FRONTEND_URL: getEnvVar("FRONTEND_URL"),
  APP_PORT: getEnvVar("APP_PORT")
};