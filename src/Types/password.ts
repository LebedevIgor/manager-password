export interface PasswordEntry {
  id: string;
  service: string;
  password: string;
  createdAt: string;
}

export interface PasswordFormValues {
  service: string;
  password: string;
}

export interface ServerResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
