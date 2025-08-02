interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithoutPassword = Omit<User, 'password'>;
