export interface User {
  id: number;
  userId: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
}
