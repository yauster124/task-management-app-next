export interface LoginFormData{
  username: string
  password: string
}

export interface RegisterFormData{
  username: string
  password: string
}

export interface Task {
  id: string
  title: string
  description: string
  doBy: Date
  taskIndex: number
  status: Status
}

export interface Tasks {
  "To do": Task[],
  "Doing": Task[],
  "Done": Task[]
}

export interface TaskForm {
  title: string
  description: string
  doBy: Date
}

export interface Status {
  id: string
  title: string
}

export type AuthResponse = {
    token: string;
}