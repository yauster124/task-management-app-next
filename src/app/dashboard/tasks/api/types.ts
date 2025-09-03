export interface Task {
  id: string
  title: string
  description: string
  doBy: string
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