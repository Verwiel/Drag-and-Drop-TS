import { Component } from "./base-component"
import { Validatable, validate } from "../util/validation"
import { AutoBind } from "../decorators/autobind"
import { projectState } from "../state/project-state"

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement
  descriptionInputEl: HTMLInputElement
  peopleInputEl: HTMLInputElement

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement
    this.descriptionInputEl = this.element.querySelector('#description') as HTMLInputElement
    this.peopleInputEl  = this.element.querySelector('#people') as HTMLInputElement

    this.configure()
  }

  // use void if no value is returned since void is exclusive to functions
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value
    const enteredDescription = this.descriptionInputEl.value
    const enteredPeople = this.peopleInputEl.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      minValue: 1,
      maxValue: 5
    }

    if (
      !validate(titleValidatable) || 
      !validate(descriptionValidatable) || 
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!')
      return
    } else {
      // use + to convert string to number, .value always returns string
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  // Public methods first
  configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  // required by Component but not needed
  renderContent() {}

  private clearInputs() {
    this.titleInputEl.value = ''
    this.descriptionInputEl.value = ''
    this.peopleInputEl.value = ''
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    // since its a tuple, check if array so it works in JS
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput
      projectState.addProject(title, description, people)
      this.clearInputs()
    }
  }
}
