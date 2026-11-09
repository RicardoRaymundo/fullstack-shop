import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';

const mockJwtService = {
  signAsync: vi.fn().mockResolvedValue('mocked-jwt-token'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: mockJwtService },],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should generate an access token for valid login credentials', async () => {
      const loginDto = { email: 'admin@admin.com', pass: '123456' };

      const result = await authService.login(loginDto);

      expect(result).toHaveProperty('access_token', 'mocked-jwt-token');
      expect(jwtService.signAsync).toHaveBeenCalled();
    });
  });
});
