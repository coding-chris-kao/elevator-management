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

    this.travel()

    console.log(`${this.name} 出發前往 ${destinationFloor.name}`)
  }

  public travel() {
    this.travelTimer = setInterval(() => {
      if (this.currentFloor === this.destinationFloor) {
        this.exchangePeople()
        clearInterval(this.travelTimer!)
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

  public exchangePeople() {
    // Let people out
    const leavingPeople = this.removePeople(this.limit, this.status)
    this.currentFloor.addPeople(leavingPeople)

    // Let people in
    if (
      this.status == ElevatorStatus.Up &&
      this.currentFloor.doesPeopleGoUp()
    ) {
      const peopleLimit = this.limit - this.people.length
      const people = this.currentFloor.removePeople(peopleLimit, this.status)
      this.addPeople(people)
    } else if (this.status == ElevatorStatus.Down) {
      this.currentFloor.doesPeopleGoDown()
    }
  }

  public addPeople(people: Person[]) {
    this.people.push(...people)
    people.forEach((person) => {
      person.currentContainer = this
    })
  }

  public removePeople(limit: number, elevatorStatus: ElevatorStatus): Person[] {
    const people: Person[] = []
    for (let i = 0; i < this.people.length; i++) {
      const person = this.people[i]
      if (person.destinationContainer == this.currentFloor) {
        people.push(...this.people.splice(i, 1))
      }
    }
    return people
  }
}
