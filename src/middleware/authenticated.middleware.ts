import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import token from '@/utils/token';
import userModel from '@/resources/user/user.model';
import TokenInterface from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';

const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(new HttpException('Not authorized', 401));
  }

  const accessToken = bearer.split(' ')[1].trim();

  try {
    const payload: TokenInterface | jwt.JsonWebTokenError =
      await token.verifyToken(accessToken);

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException('Not authorized', 401));
    }

    const user = await userModel.findById(payload.id).select('-password');

    if (!user) {
      return next(new HttpException('Not authorized', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new HttpException('Not authorized', 401));
  }
};

export default authenticated;
