import { Elevator, ElevatorStatus } from './Elevator'
import { Floor } from './Floor'

export abstract class ControlStrategy {
  abstract selectElevator(
    destinationFloor: Floor,
    elevators: Elevator[]
  ): Elevator | null
}

export class EfficentControlStrategy extends ControlStrategy {
  public selectElevator(
    destinationFloor: Floor,
    elevators: Elevator[]
  ): Elevator | null {
    for (let elevator of elevators) {
      // Is any elevator go to there
      if (elevator.destinationFloor == destinationFloor) return null

      // Idle one comes first
      if (elevator.status == ElevatorStatus.Idle) {
        return elevator
      }
    }
    return null
  }
}

export class EnergySaveControlStrategy extends ControlStrategy {
  public selectElevator(
    destinationFloor: Floor,
    elevators: Elevator[]
  ): Elevator | null {
    let workableElevators = [elevators[0]]
    for (let elevator of workableElevators) {
      // Is any elevator go to there
      if (elevator.destinationFloor == destinationFloor) return null

      // Idle one comes first
      if (elevator.status == ElevatorStatus.Idle) {
        return elevator
      }
    }
    return null
  }
}
