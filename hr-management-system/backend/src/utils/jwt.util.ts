import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export class JWTUtil {
  private static readonly SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
  private static readonly EXPIRE = process.env.JWT_EXPIRE || '7d';
  private static readonly REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.SECRET, { expiresIn: this.EXPIRE });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: this.REFRESH_EXPIRE });
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.SECRET) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as JwtPayload;
  }
}
