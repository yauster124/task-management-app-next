export interface Task {
  id: string
  title: string
  description: string
  doBy: Date
  taskIndex: number
  status: Status
}

export interface Status {
  id: string
  title: string
}

export type AuthResponse = {
    accessToken: string;
}