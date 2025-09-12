export interface Task {
  id: string
  title: string
  description: string
  doBy: Date
  taskIndex: number
  status: Status
  user: User
  categories: Category[]
  comments: Comment[]
}

export interface Status {
  id: string
  title: string
}

export interface Category {
  id: string
  title: string
}

export interface Comment {
  id: string
  content: string
  createdAt: Date
  user: User
}

export interface User {
  id: string
  username: string
}

export type AuthResponse = {
    accessToken: string;
}