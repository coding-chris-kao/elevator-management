import { Building } from './Building'
import { Containable } from './Containable'
import { ElevatorStatus } from './Elevator'
import { Person } from './Person'

export class Floor implements Containable {
  public people: Person[] = []

  constructor(public id: number, private building: Building) {}

  public get name() {
    return `${this.id + 1}F`
  }

  public addPeople(people: Person[]) {
    this.people.push(...people)
    people.forEach((person) => {
      person.currentContainer = this
      console.log(`${person.name} 進入 ${this.name}`)
    })
  }

  public takePeople(limit: number, elevatorStatus: ElevatorStatus): Person[] {
    const people: Person[] = []
    for (let i = 0; i < this.people.length; i++) {
      if (people.length == limit) break

      const person = this.people[i]
      const personStatus = this.building.getStatus(
        person.currentContainer,
        person.destinationContainer
      )
      if (personStatus == elevatorStatus) {
        people.push(...this.people.splice(i, 1))
        console.log(`${person.name} 離開 ${this.name}`)
      }
    }
    return people
  }

  public doesPeopleGoUp(): boolean {
    for (let person of this.people) {
      const status = this.building.getStatus(
        person.currentContainer,
        person.destinationContainer
      )
      if (status == ElevatorStatus.Up) {
        return true
      }
    }
    return false
  }

  public doesPeopleGoDown(): boolean {
    for (let person of this.people) {
      const status = this.building.getStatus(
        person.currentContainer,
        person.destinationContainer
      )
      if (status == ElevatorStatus.Down) {
        return true
      }
    }
    return false
  }

  public doesPeopleWait(): boolean {
    const waitingPeople = this.people.filter(
      (person) => person.currentContainer != person.destinationContainer
    )
    return waitingPeople.length > 0
  }
}
