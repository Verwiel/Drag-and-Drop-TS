import { Project, ProjectStatus } from '../models/project'

type Listener<T> = (items: T[]) => void

class State<T> {
  // protected still cant be accessed outside class but can be used by inheriting classes
  protected listeners: Listener<T>[] = []

  // whenever something changes, loop through listeners to update
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = []
  private static instance: ProjectState

  private constructor() {
    super()
  }

  static getInstance() {
    if(this.instance) {
      return this.instance
    }
    this.instance = new ProjectState
    return this.instance
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(), 
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    )
    this.projects.push(newProject)
    this.updateListeners()
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(prj => prj.id = projectId)
    if (project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      // adding slice avoids keeping it as a reference
      listenerFn(this.projects.slice())
    }
  }
}

// only ever want to work with one project state
export const projectState = ProjectState.getInstance()
