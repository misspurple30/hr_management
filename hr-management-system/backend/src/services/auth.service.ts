import { UserRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.util';
import { JWTUtil } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterData) {
    const { email, password, firstName, lastName } = data;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const hashedPassword = await PasswordUtil.hash(password);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Generation du token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JWTUtil.generateAccessToken(payload);
    const refreshToken = JWTUtil.generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginData) {
    const { email, password } = data;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JWTUtil.generateAccessToken(payload);
    const refreshToken = JWTUtil.generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);
      
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = JWTUtil.generateAccessToken(payload);
      const newRefreshToken = JWTUtil.generateRefreshToken(payload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
}
