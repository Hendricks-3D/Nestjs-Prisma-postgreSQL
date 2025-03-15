import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './services/user.service';
import { CreateUserDto } from './models-dto/create-user-dto';
import { LoginDto } from './models-dto/login-dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UserService;

  beforeEach(async () => {
    // Mock UserService methods
    const mockUserService = {
      signUp: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
      login: jest.fn().mockResolvedValue({ accessToken: 'mockedAccessToken' }),
      getUserProfile: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'test@example.com' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        id: 0,
        firstName: '',
        lastName: '',
        blocked: false,
      };
      const result = await controller.create(createUserDto);
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
      expect(userService.signUp).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = await controller.login(loginDto);
      expect(result).toEqual({ accessToken: 'mockedAccessToken' });
      expect(userService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getUserprofile', () => {
    it('should return user profile', async () => {
      const mockRequest = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.getUserprofile(mockRequest);
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
      expect(userService.getUserProfile).toHaveBeenCalledWith(mockRequest.user);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', () => {
      const params = { id: 1 };
      const result = controller.getUserById(params);
      expect(result).toBe('This action returns a #1 user');
    });
  });
});
