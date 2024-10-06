import { Socket } from "socket.io";

export abstract class BaseGameState {
  constructor() {}

  abstract gameBaseState(key: string): Promise<any>;
  abstract onConnect(socket: Socket): void;
  abstract onPlayerLeave(): void;
  abstract onPlayerLeaveMatch(): void;
  abstract onReJoinMatch(): void;
}
