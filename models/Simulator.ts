import { Building } from './Building'
import { Elevator } from './Elevator'
import { Floor } from './Floor'
import { Person } from './Person'

export class Simulator {
  public floorCount: number = 10
  public elevatorCount: number = 2
  public elevatorLimit: number = 5
  public elevatorTravelTime: number = 1000
  public elevatorExchangeTime: number = 1000

  public start() {
    // Create building
    const building = new Building()

    // Create floors
    for (let i = 0; i < this.floorCount; i++) {
      const floor = new Floor(i, building)
      building.registerFloor(floor)
    }

    // Create elevators
    for (let i = 0; i < this.elevatorCount; i++) {
      const elevator = new Elevator(
        i,
        this.elevatorLimit,
        this.elevatorTravelTime,
        this.elevatorExchangeTime,
        building,
        building.floors[0]
      )
      building.registerElevator(elevator)
    }

    // Create person
    this.createPerson(1, building)

    // The Building start monitoring
    building.startMonitor()
  }

  public createPerson(id: number, building: Building): Person {
    // let from = Math.floor(Math.random() * this.floorCount)
    // let to
    // do {
    //   to = Math.floor(Math.random() * this.floorCount)
    // } while (to == from)
    let from = 5
    let to = 3
    const person = new Person(1, building.floors[from], building.floors[to])
    person.callElevator()

    return person
  }
}
