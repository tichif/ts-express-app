import { Request, Response, NextFunction, Router } from 'express';

import HttpException from '@/utils/exceptions/http.exception';
import UserService from '@/resources/user/user.service';
import Controller from '@/utils/interfaces/controller.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import authenticated from '@/middleware/authenticated.middleware';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );

    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );

    this.router.get(`${this.path}`, authenticated, this.getUser);
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const token = await this.userService.login(email, password);

      return res.status(200).json({ token });
    } catch (error: any) {
      return next(new HttpException(error.message, 400));
    }
  };

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password } = req.body;

      const token = await this.userService.register(
        name,
        email,
        password,
        'user'
      );
      res.status(201).json({ token });
    } catch (error: any) {
      return next(new HttpException(error.message, 400));
    }
  };

  private getUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return next(new HttpException('No user found', 404));
    }

    return res.status(200).json({ user: req.user });
  };
}

export default UserController;
