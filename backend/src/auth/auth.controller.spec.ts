import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';


const mockAuthService = {
  login: vi.fn().mockImplementation((dto: LoginDto) => Promise.resolve({ access_token: 'mocked-jwt-token' })),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct DTO and return a token', async () => {
      const loginDto: LoginDto = { email: 'admin@admin.com', pass: '123456' };

      const result = await controller.login(loginDto);

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
