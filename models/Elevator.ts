import { Building } from './Building'
import { Containable } from './Containable'
import { Floor } from './Floor'
import { Person } from './Person'

export enum ElevatorStatus {
  Up,
  Down,
  Idle,
}

export class Elevator implements Containable {
  public people: Person[] = []
  public status: ElevatorStatus = ElevatorStatus.Idle
  public destinationFloor: Floor | null = null
  public travelTimer: NodeJS.Timeout | null = null

  constructor(
    public id: number,
    public limit: number,
    public travelTime: number,
    public exchangeTime: number,
    public building: Building,
    public currentFloor: Floor
  ) {}

  public get name(): string {
    return `電梯#${this.id}`
  }

  public assignTask(status: ElevatorStatus, destinationFloor: Floor) {
    this.status = status
    this.destinationFloor = destinationFloor

    if (!this.travelTimer) {
      this.travel()
    }

    console.log(`${this.name} 出發前往 ${destinationFloor.name}`)
  }

  public travel(): void {
    this.travelTimer = setInterval(() => {
      if (this.currentFloor === this.destinationFloor) {
        console.log(`${this.name} 抵達 ${this.destinationFloor.name} 了`)
        this.exchangePeople()

        if (this.people.length > 0) {
          this.changeDestinationFloor()
        } else {
          this.setElevatorToIdle()
        }
        return
      }

      if (this.status == ElevatorStatus.Up) {
        const index = this.building.floors.indexOf(this.currentFloor)
        this.currentFloor = this.building.floors[index + 1]
      } else if (this.status == ElevatorStatus.Down) {
        const index = this.building.floors.indexOf(this.currentFloor)
        this.currentFloor = this.building.floors[index - 1]
      }
    }, this.travelTime)
  }

  public exchangePeople(): void {
    this.letPeopleOut()

    this.letPeopleIn()

    // Turn over
    if (this.people.length == 0) {
      if (this.status == ElevatorStatus.Up) this.status = ElevatorStatus.Down
      else if (this.status == ElevatorStatus.Down)
        this.status = ElevatorStatus.Up
      this.letPeopleIn()
    }

    // Nobody come in, elevator become idle
    if (this.people.length == 0) {
      this.setElevatorToIdle()
    }
  }

  public letPeopleOut() {
    const leavingPeople = this.takePeople()
    this.currentFloor.addPeople(leavingPeople)
  }

  public letPeopleIn() {
    if (
      (this.status == ElevatorStatus.Up &&
        this.currentFloor.doesPeopleGoUp()) ||
      (this.status == ElevatorStatus.Down &&
        this.currentFloor.doesPeopleGoDown()) ||
      this.status == ElevatorStatus.Idle
    ) {
      const peopleLimit = this.limit - this.people.length
      const people = this.currentFloor.takePeople(peopleLimit, this.status)
      this.addPeople(people)
    }
  }

  public addPeople(people: Person[]) {
    this.people.push(...people)
    people.forEach((person) => {
      person.currentContainer = this
      console.log(`${person.name} 進入 ${this.name}`)
    })
  }

  public takePeople(): Person[] {
    const people: Person[] = []
    for (let i = 0; i < this.people.length; i++) {
      const person = this.people[i]
      if (person.destinationContainer == this.currentFloor) {
        people.push(...this.people.splice(i, 1))
        console.log(`${person.name} 離開 ${this.name}`)
      }
    }
    return people
  }

  public setElevatorToIdle() {
    clearInterval(this.travelTimer!)
    this.travelTimer = null
    this.status = ElevatorStatus.Idle
  }

  public changeDestinationFloor() {
    let floorIds = this.people.map((person) =>
      this.building.floors.indexOf(person.destinationContainer)
    )

    if (this.status == ElevatorStatus.Up) {
      floorIds.sort((a, b) => a - b)
    } else if (this.status == ElevatorStatus.Down) {
      floorIds.sort((a, b) => b - a)
    }

    const nextFloor = this.building.floors[floorIds[0]]
    this.assignTask(this.status, nextFloor)
  }
}
