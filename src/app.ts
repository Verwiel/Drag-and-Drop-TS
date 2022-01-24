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

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    console.log(this.titleInputEl.value);
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }
  
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

const prjInput = new ProjectInput
