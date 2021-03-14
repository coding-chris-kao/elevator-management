import { Containable } from './Containable'
import { Elevator, ElevatorStatus } from './Elevator'
import { Floor } from './Floor'

export class Building {
  public floors: Floor[] = []
  public elevators: Elevator[] = []
  public monitorTimer: NodeJS.Timeout | null = null
  public monitorTimerPeriod: number = 1000

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

    throw new Error('目前不支援這項操作')
  }

  public startMonitor() {
    this.monitorTimer = setInterval(() => {
      this.monitor()
    }, this.monitorTimerPeriod)
  }

  public monitor() {
    for (let floor of this.floors) {
      if (floor.doesPeopleWait()) {
        const elevator = this.selectElevator(floor)
        if (!elevator) {
          continue
        }

        // TODO: 1F 電梯往 3F 時，5F 有人按電梯，電梯目標應改為 5F，原 3F 成為中途站
        const newStatus = this.getStatus(elevator.currentFloor, floor)
        elevator.assignTask(newStatus, floor)
      }
    }
  }

  public selectElevator(destinationFloor: Floor): Elevator | null {
    for (let elevator of this.elevators) {
      // Is any elevator go to there
      if (elevator.destinationFloor == destinationFloor) return null

      // Idle one comes first
      if (elevator.status == ElevatorStatus.Idle) {
        return elevator
      }
      // Then the same direction one
      // if (elevator.status == ElevatorStatus.Up)
    }
    return null
  }
}
