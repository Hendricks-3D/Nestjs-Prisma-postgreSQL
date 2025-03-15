import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtService = {
      /* mock implementation of JwtService */
    } as JwtService;
    expect(new AuthGuard(jwtService)).toBeDefined();
  });
});
