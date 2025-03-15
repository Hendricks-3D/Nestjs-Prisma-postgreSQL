import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUserDto = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    blocked: false,
  };
  const mockUser = { ...mockUserDto, password: 'hashedPassword' };

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockedAccessToken'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mock implementations before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user if email does not exist', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockUser.password as never);

      const result = await service.signUp(mockUserDto);
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...mockUserDto, password: mockUser.password },
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      await expect(service.signUp(mockUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('encryptPassword', () => {
    it('should return a hashed password', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      const result = await service.encryptPassword('password123', 10);
      expect(result).toBe('hashedPassword');
    });
  });

  describe('decryptPassword', () => {
    it('should return true if passwords match', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      expect(
        await service.decryptPassword('password123', 'hashedPassword'),
      ).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      expect(
        await service.decryptPassword('password123', 'wrongHashedPassword'),
      ).toBe(false);
    });
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(service, 'decryptPassword').mockResolvedValue(true);

      const result = await service.login(mockUserDto);
      expect(result).toEqual({ accessToken: 'mockedAccessToken' });
    });

    it('should throw BadRequestException if user does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.login(mockUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(service, 'decryptPassword').mockResolvedValue(false);

      await expect(service.login(mockUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile if user exists', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.getUserProfile(mockUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserProfile(mockUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
