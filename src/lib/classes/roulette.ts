import { Namespace, Socket } from "socket.io";
import { BaseGameState } from "./baseGameState";
import { IGameState } from "../../interfaces/states";
import { RedisError } from "../../utils/RedisError.utils";

export class Roulette extends BaseGameState {
  io: Namespace;

  constructor(serverSocket: Namespace) {
    super();
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
    // here this inside bind represents socket object and is same as (socket)=> {this.onConnect.bind(socket)}
  }

  async onConnect(clientSocket: Socket): Promise<void> {
    try {
      let { id } = clientSocket.handshake.query;

      const userData: IGameState = {
        ...clientSocket.data,
        userId: id,
        socketId: clientSocket.id,
        updatedAt: new Date(),
      };

      console.log("--------connection-----------");
      console.log("userData :", userData);

      clientSocket.on(
        "ROOM_CREATE",
        this.onRoomCreate.bind(this, clientSocket)
      );

      clientSocket.on("SET_BET", this.onSetBetAmount.bind(this, clientSocket));

      clientSocket.on("SPIN_REELS", this.onSpinReels.bind(this, clientSocket));

      clientSocket.on(
        "REPLAY_MATCH",
        this.onReplayMatch.bind(this, clientSocket)
      );

      clientSocket.on("EXIT_MATCH", this.onExitMatch.bind(this, clientSocket));
    } catch (error: any) {
      console.error("error occured during onConnect :", error?.message);

      clientSocket.disconnect(true);
    }
  }

  async onRoomCreate(clientSocket: Socket): Promise<any> {
    try {
      console.log(clientSocket.id, ":", clientSocket.data);

      if (!clientSocket.data.host)
        throw new RedisError(400, "can't create room if not host");

      let gameId = crypto.randomUUID();
      gameId = `roulette:games:${gameId}`;

      let roomId = crypto.randomUUID();
      roomId = `roulette:rooms:${roomId}`;

      const gameState = {
        userId: [clientSocket.data.userId],
        gameId: gameId,
        socketId: [clientSocket.id],
        roomId: roomId,
        totalBalance: 1000, //dummy money must come from opertor
      } as unknown as IGameState;

      clientSocket.data["gameState"] = gameState;

      // this must be stored in redis ? the room state and game state and roomid to id list
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
    }
  }

  async onSetBetAmount(clientSocket: Socket): Promise<any> {
    try {
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
    }
  }

  async onSpinReels(clientSocket: Socket): Promise<any> {
    try {
    } catch (error: any) {
      console.error("error occured during onSpinReels :", error?.message);
    }
  }

  async onReplayMatch(clientSocket: Socket): Promise<any> {
    try {
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
    }
  }

  async onExitMatch(clientSocket: Socket): Promise<any> {
    try {
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
    }
  }

  onPlayerLeave(): void {}

  onPlayerLeaveMatch(): void {}

  onReJoinMatch(): void {}
}
