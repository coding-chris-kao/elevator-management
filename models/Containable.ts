import { ElevatorStatus } from './Elevator'
import { Person } from './Person'

export interface Containable {
  maxPeople?: number
  people: Person[]
  addPeople(people: Person[]): void
  takePeople(limit: number, elevatorStatus: ElevatorStatus): Person[]
}
