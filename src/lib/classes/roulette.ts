import { Namespace, Socket } from "socket.io";
import { BaseGameState } from "./baseGameState";
import {
  IGameState,
  IPlayerState,
  IRedisUser,
  playerStatus,
} from "../../interfaces/states";
import { RedisError } from "../../utils/RedisError.utils";
import { redisClient } from "../cache/redisClient";

export class Roulette extends BaseGameState {
  io: Namespace;
  rbsKey: string = "";

  constructor(serverSocket: Namespace) {
    super();
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
    // here this inside bind represents socket object and is same as (socket)=> {this.onConnect.bind(socket)}
  }

  async gameBaseState(): Promise<any> {
    try {
      const rouletteBaseState = await redisClient.getFromRedis(this.rbsKey);

      return rouletteBaseState;
    } catch (error: any) {
      console.error(error?.message);
    }
  }

  async onConnect(clientSocket: Socket): Promise<void> {
    try {
      let { id } = clientSocket.handshake.query;

      const userData: IRedisUser = {
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

      clientSocket.on("JOIN_ROOM", this.onJoinRoom.bind(this, clientSocket));

      clientSocket.on(
        "START_MATCH",
        this.onStartMatch.bind(this, clientSocket)
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

      if ([...clientSocket.rooms].length > 1)
        throw new RedisError(
          403,
          "player cannot join or create another unless they are part of one"
        );

      let gameId = crypto.randomUUID();
      gameId = `roulette:games:${gameId}`;

      let roomId = crypto.randomUUID();
      roomId = `roulette:rooms:${roomId}`;

      // if this should be done here or somewhere else
      // const userData: IRedisUser = {
      //   ...clientSocket.data,
      //   updatedAt: new Date(),
      // };

      const playerData: IPlayerState = {
        userId: clientSocket.data.userId,
        gameId: gameId,
        socketId: clientSocket.id,
        roomId: roomId,
        totalBalance: clientSocket.data.amount,
        playerStatus: playerStatus.HOST,
      };

      const gameState: IGameState = {
        roomId: roomId,
        gameId: gameId,
        userIds: [clientSocket.data?.userId],
        socketIds: [clientSocket.id],
        playerStates: [playerData],
      };

      clientSocket.data = playerData;

      clientSocket.join(roomId);
      // this must be stored in redis ? the room state and game state and roomid to id list

      // game set to redis
      await redisClient.setToRedis(gameId, gameState);

      // room set to redis
      await redisClient.setToRedis(roomId, gameState);

      clientSocket.emit(
        "MESSAGE",
        `room created with roomId : ${roomId} by host : ${clientSocket.id} and gameId: ${gameId}`
      );

      return;
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
    }
  }

  async onJoinRoom(clientSocket: Socket, data: any): Promise<any> {
    try {
      console.log(clientSocket.id, ":", clientSocket.data);

      if (clientSocket.data.host)
        throw new RedisError(
          400,
          "host cannot join the room as they are already player"
        );

      if (!data.roomId || !data.gameId)
        throw new RedisError(400, "gameId or roomId is invalid or not sent");

      let roomData = await redisClient.getFromRedis(data.roomId);

      if (!roomData)
        throw new RedisError(404, "room with roomId doesn't exist");

      if (roomData?.gameId !== data.gameId)
        throw new RedisError(400, "gameId of selected room is incorrect");

      const rouletteBaseState = await this.gameBaseState();

      if (roomData.userId?.length >= rouletteBaseState.playerStregnth)
        throw new RedisError(400, "room is full");

      roomData.userId.push(clientSocket?.data?.userId);
      roomData.socketId.push(clientSocket.id);

      clientSocket.data["gameState"] = roomData?.gameState;
    } catch (error: any) {
      console.error("error occured during onJoinRoom :", error?.message);
    }
  }

  async onStartMatch(clientSocket: Socket): Promise<any> {
    try {
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
