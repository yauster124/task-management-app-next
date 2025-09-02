export interface Task {
  id: string
  title: string
  description: string
  doBy: string
  done: boolean
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