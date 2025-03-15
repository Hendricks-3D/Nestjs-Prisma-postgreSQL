import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserTaskService {
  async getTodoList(): Promise<Task[]> {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos`,
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new BadRequestException();
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
    return [];
  }
}
