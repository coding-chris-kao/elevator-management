import { Building } from './Building'
import { EfficentControlStrategy } from './ControlStrategy'
import { Elevator } from './Elevator'
import { Floor } from './Floor'
import { Person } from './Person'

export class Simulator {
  public simulationPeriod = 1000
  public totlePeople = 3
  public floorCount: number = 10
  public elevatorCount: number = 1
  public elevatorLimit: number = 5
  public elevatorTravelTime: number = 1000
  public elevatorExchangeTime: number = 1000
  public callElevatorDelay: number = 1000

  public start() {
    // Create building
    const building = new Building(this.totlePeople)

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

    // Create person and run the simulation
    let personId = 1

    const simulationTimer = setInterval(() => {
      const person = this.createPerson(personId, building)
      person.callElevator(this.callElevatorDelay)
      personId++
      if (personId > this.totlePeople) {
        clearInterval(simulationTimer)
      }
    }, this.simulationPeriod)

    // Test
    // this.testCreatePerson(building)

    // The Building start monitoring
    building.startMonitor(new EfficentControlStrategy())
  }

  public testCreatePerson(building: Building) {
    let from, to

    from = 0
    to = 9
    const person1 = new Person(1, building.floors[from], building.floors[to])
    person1.callElevator(this.callElevatorDelay)

    from = 1
    to = 3
    const person2 = new Person(2, building.floors[from], building.floors[to])
    person2.callElevator(this.callElevatorDelay)

    from = 2
    to = 8
    const person3 = new Person(3, building.floors[from], building.floors[to])
    person3.callElevator(this.callElevatorDelay)
  }

  public createPerson(id: number, building: Building): Person {
    let from = Math.floor(Math.random() * this.floorCount)
    let to
    do {
      to = Math.floor(Math.random() * this.floorCount)
    } while (to == from)
    const person = new Person(id, building.floors[from], building.floors[to])
    return person
  }
}
