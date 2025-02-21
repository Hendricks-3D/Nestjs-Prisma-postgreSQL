export interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  password: string;
  createdAt: Date;
  blocked: boolean;
}
