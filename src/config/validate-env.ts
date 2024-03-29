import { cleanEnv, str, url } from 'envalid'

export const env = cleanEnv(process.env, {
  PORT: str(),
  MONGODB_URI: url(),
})
