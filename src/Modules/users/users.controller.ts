import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from './models-dto/create-user-dto';
import { ValidateUserId } from './Validations/users.validations';
import { LoginDto } from './models-dto/login-dto';
import { AuthGuard } from './auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}
  //POST
  @Post('/signup')
  // @UsePipes(new ValidationPipe({ transform: true }))//Transform payload objects to class instances
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  //GET

  @Get('/profile')
  @UseGuards(AuthGuard)
  getUserprofile(@Request() request) {
    return request.user;
    //   this.userService.getUserProfile(loginData);
  } /**
   *
   * @param params is used to get the id of the user then Validates it with the FindOneParams class
   */
  @Get(':id')
  getUserById(@Param() params: ValidateUserId) {
    return `This action returns a #${params.id} user`;
  }
  //PUT

  //DELETE
}
