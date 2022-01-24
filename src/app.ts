// Validation
interface Validatable {
  value: string | number,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  minValue?: number,
  maxValue?: number
}

function validate(validatableInput: Validatable) {
  let isValid = true
  if(validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength
  }
  if(validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength
  }
  if(validatableInput.minValue != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.minValue
  }
  if(validatableInput.maxValue != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.maxValue
  }
  return isValid
}

// autobind decorator
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const ogMethod = descriptor.value
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = ogMethod.bind(this)
      return boundFn
    }
  }
  return adjDescriptor
}

// project input
class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLFormElement
  titleInputEl: HTMLInputElement
  descriptionInputEl: HTMLInputElement
  peopleInputEl: HTMLInputElement


  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
    this.hostElement = document.getElementById('app')! as HTMLDivElement

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLFormElement
    this.element.id = 'user-input'

    this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement
    this.descriptionInputEl = this.element.querySelector('#description') as HTMLInputElement
    this.peopleInputEl  = this.element.querySelector('#people') as HTMLInputElement

    this.configure()
    this.attach()
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
      console.log(title, description, people);
      this.clearInputs()
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }
  
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

const prjInput = new ProjectInput
