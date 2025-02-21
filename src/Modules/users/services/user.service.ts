import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../models-dto/create-user-dto';
import { User } from '../models/user';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from '../models-dto/login-dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(payload: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { email: payload.email },
    });
    if (user) {
      throw new BadRequestException('User already exist', {
        cause: new Error(),
        description: 'Duplicate user',
      });
    } else {
      const hashedPassword = await this.encryptPassword(payload.password, 10);
      payload.password = hashedPassword;
      return await this.prismaService.user.create({
        data: { ...payload },
      });
    }
  }

  async encryptPassword(userPassword, saltRound): Promise<string> {
    //encrypt password with bcryptjs
    return await bcrypt.hash(userPassword, saltRound);
  }

  async decryptPassword(userPassword, hashedPassword): Promise<boolean> {
    //decrypt password with bcryptjs
    return await bcrypt.compare(userPassword, hashedPassword);
  }

  async login(loginRes: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginRes.email },
    });

    if (!user) {
      throw new BadRequestException('User does not exist', {
        cause: new Error(),
        description: 'User not found',
      });
    }
    const isPasswordMatch = await this.decryptPassword(
      loginRes.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password', {
        cause: new Error(),
        description: 'Password does not match',
      });
    }

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      { expiresIn: '1d' },
    );
    return { accessToken };
  }

  //Get user profile
  async getUserProfile(loginData: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new BadRequestException('User does not exist', {
        cause: new Error(),
        description: 'User not found',
      });
    }
    return user;
  }
}
