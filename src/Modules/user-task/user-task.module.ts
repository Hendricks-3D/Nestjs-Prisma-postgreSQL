import { Module } from '@nestjs/common';
import { UserTaskController } from './user-task.controller';
import { UserTaskService } from './service/user-task.service';

@Module({
  controllers: [UserTaskController],
  providers: [UserTaskService],
})
export class UserTaskModule {}
