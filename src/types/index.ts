export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
