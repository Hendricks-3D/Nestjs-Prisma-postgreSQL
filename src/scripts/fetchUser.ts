import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserTaskService } from '../Modules/user-task/service/user-task.service';

async function fetchUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const taskService = app.get(UserTaskService);
    const todoList = taskService.getTodoList();
    console.log(todoList);
  } catch (e) {
    console.error(e);
  } finally {
    await app.close();
  }
}

fetchUser();
