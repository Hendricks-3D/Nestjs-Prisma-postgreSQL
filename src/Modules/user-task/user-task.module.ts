import { Module } from '@nestjs/common';
import { UserTaskController } from './user-task.controller';

@Module({
  controllers: [UserTaskController],
})
export class UserTaskModule {}
