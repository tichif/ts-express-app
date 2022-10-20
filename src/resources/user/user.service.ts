import UserInterface from '@/resources/user/user.interface';
import token from '@/utils/token';
import UserModel from '@/resources/user/user.model';

class UserService {
  private user = UserModel;

  /**
   * Register user
   */
  public async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<string | Error> {
    try {
      const user = await this.user.create({ name, email, password, role });
      const accessToken = token.createToken(user);
      return accessToken;
    } catch (err: any) {
      throw new Error('Cannot create User');
    }
  }

  /**
   * Login user
   */

  public async login(email: string, password: string): Promise<Error | string> {
    try {
      const user = await this.user.findOne({ email });

      if (!user) {
        throw new Error('Email or password incorrect');
      }

      const isValid = await user.isValidPassword(password);

      if (!isValid) {
        throw new Error('Email or password incorrect');
      }

      return token.createToken(user);
    } catch (error) {
      throw new Error('Email or password incorrect');
    }
  }
}

export default UserService;
