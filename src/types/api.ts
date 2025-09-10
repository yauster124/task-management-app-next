export interface Task {
  id: string
  title: string
  description: string
  doBy: Date
  taskIndex: number
  status: Status
  categories: Category[]
}

export interface Status {
  id: string
  title: string
}

export interface Category {
  id: string
  title: string
}

export type AuthResponse = {
    accessToken: string;
}