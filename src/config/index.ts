import createError from "http-errors";
import "dotenv/config";
const PORT = process.env.PORT || 5000;
const smtpUserName = process.env.SMTP_EMAIL;
const smtpPassword = process.env.SMTP_PASSWORD;
const dbURL = process.env.dbURL || "mongodb://localhost:27017/CupidChatDB";
const jwt_access_secret = process.env.JWT_ACCESS_SECRET || "dfdfdsfdfdfdsf";
const jwt_refresh_secret =
  process.env.JWT_REFRESH_SECRET || "dfhkdsfhkdsfhkdsf";
const jwt_access_exp = process.env.JWT_ACCESS_EXP || "15m";
const jwt_refresh_exp = process.env.JWT_REFRESH_EXP || "30d";
const client_url = process.env.CLIENT_URL || "http://localhost:3000";
const jwt_password_reset_secret =
  process.env.JWT_PASSWORD_RESET_SECRET || "dfdsfdsfdsfdsfdsf";
const jwt_password_reset_exp = process.env.JWT_PASSWORD_EXP || "10m";
const image_upload_api_key =
  process.env.IMAGE_UPLOAD_API_KEY || "af5eb05e3b4d99bafcf53976e9765765";

const process_registation_secret_key =
  process.env.P_REGISTATION_KEY || "dfdsfdsfdsfdsfdsf";

const process_registation_expires_in = process.env.P_REGISTATION_EXP || "10m";

export {
  process_registation_secret_key,
  process_registation_expires_in,
  createError,
  PORT,
  smtpUserName,
  smtpPassword,
  dbURL,
  jwt_access_secret,
  jwt_refresh_secret,
  jwt_access_exp,
  jwt_refresh_exp,
  client_url,
  jwt_password_reset_secret,
  jwt_password_reset_exp,
  image_upload_api_key,
};
