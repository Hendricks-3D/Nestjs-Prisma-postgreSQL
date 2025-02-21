import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Modules/users/users.module';
import { UserTaskModule } from './Modules/user-task/user-task.module';

@Module({
  imports: [UsersModule, UserTaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
