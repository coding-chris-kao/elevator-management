import { Containable } from './Containable'
import { Floor } from './Floor'

export class Person {
  constructor(
    public id: number,
    public currentContainer: Containable,
    public destinationContainer: Floor
  ) {
    if (
      currentContainer instanceof Floor &&
      destinationContainer instanceof Floor
    ) {
      console.log(
        `${this.name} 出現在 ${currentContainer.name}，他想要去 ${destinationContainer.name}`
      )
    }
  }

  public get name(): string {
    return `人物#${this.id}`
  }

  public callElevator(delay: number) {
    setTimeout(() => {
      this.currentContainer.addPeople([this])
    }, delay)
  }
}
