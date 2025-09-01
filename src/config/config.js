import dotenv from 'dotenv';
dotenv.config();

//variables individuales
const JWT_SECRET = process.env.JWT_SECRET || 'miClaveSuperSecreta';
const PORT = process.env.PORT || 8081;
const MONGO_URI = process.env.MONGO_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const NODE_ENV = process.env.NODE_ENV || 'development';

export const config = {
  server: {
    port: PORT
  },
  mongo: {
    uri: MONGO_URI
  },
  jwt: {
    secret: JWT_SECRET
  },
  email: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
  environment: NODE_ENV
};

export { JWT_SECRET, PORT, MONGO_URI, EMAIL_USER, EMAIL_PASS, NODE_ENV };