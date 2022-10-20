import UserInterface from '@/resources/user/user.interface';

declare global {
  namespace Express {
    export interface Request {
      user: UserInterface;
    }
  }
}
