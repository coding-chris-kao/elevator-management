import { Containable } from './Containable'
import { ControlStrategy } from './ControlStrategy'
import { Elevator, ElevatorStatus } from './Elevator'
import { Floor } from './Floor'

export class Building {
  public floors: Floor[] = []
  public elevators: Elevator[] = []
  public monitorTimer: NodeJS.Timeout | null = null
  public monitorTimerPeriod: number = 500
  public servicedCount: number = 0

  constructor(public targetServicedCount: number) {}

  public registerFloor(floor: Floor) {
    this.floors.push(floor)
  }

  public registerElevator(elevator: Elevator) {
    this.elevators.push(elevator)
  }

  public getStatus(from: Containable, to: Containable): ElevatorStatus {
    if (from instanceof Floor && to instanceof Floor) {
      const fromIdx = this.floors.indexOf(from)
      const toIdx = this.floors.indexOf(to)

      if (fromIdx < toIdx) {
        return ElevatorStatus.Up
      } else if (fromIdx > toIdx) {
        return ElevatorStatus.Down
      } else {
        return ElevatorStatus.Idle
      }
    }

    throw new TypeError(`${from}, ${to}`)
  }

  public addServicedCount() {
    this.servicedCount++
  }

  public startMonitor(controlStrategy: ControlStrategy) {
    const isValidated = this.validate()
    if (!isValidated) {
      console.error('樓層數必須大於 1，電梯數必須大於 0')
      return
    }

    const startTime = Date.now()

    this.monitorTimer = setInterval(() => {
      for (let floor of this.floors) {
        if (floor.doesPeopleWait()) {
          const elevator = controlStrategy.selectElevator(floor, this.elevators)
          if (!elevator) {
            continue
          }

          const newStatus = this.getStatus(elevator.currentFloor, floor)
          elevator.assignTask(newStatus, floor)
        }
      }

      const elapsedTime = Date.now() - startTime
      if (this.servicedCount >= this.targetServicedCount) {
        clearInterval(this.monitorTimer!)
        this.monitorTimer = null
        console.warn(
          `模擬結束，花費時間： ${Math.round((elapsedTime - 1000) / 1000)} 秒` // delay for one travelTime when the first elevator starts
        )
      }
    }, this.monitorTimerPeriod)
  }

  public validate(): boolean {
    return this.floors.length > 1 && this.elevators.length > 0
  }
}
