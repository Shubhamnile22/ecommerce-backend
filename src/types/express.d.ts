import { User } from '../auth/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
