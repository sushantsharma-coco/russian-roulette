import { Namespace, Socket } from "socket.io";
import { BaseGameState } from "./baseGameState";
import {
  GameSettings,
  gameStatus,
  IGameState,
  IPlayerState,
  IRedisUser,
  playerStatus,
  IBetData,
} from "../../interfaces/states";
import { RedisError } from "../../utils/RedisError.utils";
import { redisClient } from "../cache/redisClient";

export class BetRoulette {
  tableNumbers: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  ];
  reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  blacks = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  bet: IBetData | IBetData[];

  constructor(bet: IBetData | IBetData[]) {
    this.bet = bet;
    let resultNum = this.genNum();

    if (Array.isArray(this.bet)) {
      this.bet.forEach((b) => {
        b = { ...b, resNum: resultNum };
      });
    } else this.bet = { ...this.bet, resNum: resultNum };
  }

  genNum(): number {
    return Math.floor(Math.random() * 36 + 1);
  }
}

export class Roulette extends BaseGameState {
  io: Namespace;
  rbsKey: string = "";

  constructor(serverSocket: Namespace) {
    super();
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
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

      clientSocket.data = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzAzODRiYzJhMzYxMjg0MTIwNGMwMDYiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjgyODQyNDQsImV4cCI6MTcyODcxNjI0NH0.QKHraLApPZKiu2PXZM77fVzCB1DDftEPGbhY5UVNgok",
        amount: 250,
        userName: "sunil",
        userId: "670384bc2a3612841204c006",
        status: true,
      };

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

      clientSocket.on("SPIN_WHEEL", this.onSpinWheel.bind(this, clientSocket));

      clientSocket.on("EXIT_MATCH", this.onExitMatch.bind(this, clientSocket));

      clientSocket.on("INFO", this.onMatchInfo.bind(this, clientSocket));
    } catch (error: any) {
      console.error("error occured during onConnect :", error?.message);

      clientSocket.disconnect(true);
    }
  }

  async onRoomCreate(clientSocket: Socket): Promise<any> {
    try {
      console.log("+++++ROOM_CREATE+++++");

      console.log(clientSocket.id, ":", clientSocket.data);

      clientSocket.data.host = true;

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
        playerStatus: playerStatus.host,
      };

      const gameState: IGameState = {
        roomId: roomId,
        gameId: gameId,
        userIds: [clientSocket.data?.userId],
        socketIds: [clientSocket.id],
        playerStates: [playerData],
        gameStatus: gameStatus.ONE,
      };

      clientSocket.data = playerData;

      clientSocket.join(roomId);
      // this must be stored in redis ? the room state and game state and roomid to id list

      // game set to redis
      await redisClient.setToRedis(gameId, gameState);

      // room set to redis
      await redisClient.setToRedis(roomId, gameState);

      clientSocket.emit("MESSAGE", {
        message: `room created with roomId : ${roomId} by host : ${clientSocket.id} and gameId: ${gameId}`,
        ...gameState,
      });

      return;
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
      clientSocket.emit("ERROR", error?.message);
    }
  }

  async onJoinRoom(clientSocket: Socket, data: any): Promise<any> {
    try {
      console.log("+++++JOIN_ROOM+++++");
      console.log(clientSocket.id, ":", clientSocket.data);

      if (clientSocket.data.host)
        throw new RedisError(
          400,
          "host cannot join the room as they are already player"
        );

      if (!data.roomId || !data.gameId)
        throw new RedisError(400, "gameId or roomId is invalid or not sent");

      let roomDataGmSte = await redisClient.getFromRedis(data.roomId);
      console.log("roomDataGmSte", roomDataGmSte);

      if (!roomDataGmSte)
        throw new RedisError(404, "room with roomId doesn't exist");

      if (roomDataGmSte?.gameId !== data.gameId)
        throw new RedisError(400, "gameId of selected room is incorrect");

      if (roomDataGmSte?.roomId !== data.roomId)
        throw new RedisError(400, "roomId of selected room is incorrect");

      const rouletteBaseState: GameSettings = await this.gameBaseState();

      if (
        // roomDataGmSte.userId?.length >= rouletteBaseState.playerStregnth ||
        roomDataGmSte.userId?.length >= 8
      )
        throw new RedisError(400, "room is full");

      if ([...clientSocket.rooms].length > 1)
        throw new RedisError(403, "cannot join multiple match at once");

      const playerData: IPlayerState = {
        userId: clientSocket.data.userId,
        socketId: clientSocket.id,
        gameId: data.gameId,
        roomId: data.roomId,
        totalBalance: clientSocket.data.amount,
        playerStatus: playerStatus.player,
      };

      clientSocket.data = playerData;
      clientSocket.join(data.roomId);

      roomDataGmSte.userIds.push(clientSocket?.data?.userId);
      roomDataGmSte.socketIds.push(clientSocket.id);
      roomDataGmSte.playerStates.push(playerData);
      roomDataGmSte.gameStatus = gameStatus.TWO;

      await redisClient.setToRedis(roomDataGmSte.roomId, roomDataGmSte);
      await redisClient.setToRedis(roomDataGmSte.gameId, roomDataGmSte);

      clientSocket.emit(
        "MESSAGE",
        `room joined with roomId : ${roomDataGmSte.roomId} by host : ${clientSocket.id} and gameId: ${roomDataGmSte.gameId}`
      );

      clientSocket.in(roomDataGmSte.roomId).emit("MESSAGE", {
        message: `user with userId: ${clientSocket.data.userId} and socketId: ${clientSocket.id} joined the game`,
        ...roomDataGmSte,
      });

      return;
    } catch (error: any) {
      console.error("error occured during onJoinRoom :", error?.message);
      clientSocket.emit("ERROR", error?.message);
    }
  }

  async onStartMatch(clientSocket: Socket): Promise<any> {
    try {
      console.log("+++++START_GAME+++++");
      console.log(clientSocket.id, ":", clientSocket.data);

      if (clientSocket.data.playerStatus !== "HOST")
        throw new RedisError(403, "only host is allowed to start match");

      const roomDataGmSte = await redisClient.getFromRedis(
        clientSocket.data?.roomId
      );
      console.log("roomDataGmSte", roomDataGmSte);

      if (!roomDataGmSte)
        throw new RedisError(404, "room with id not found to start game");

      if (roomDataGmSte.gameStatus === "START_MATCH")
        throw new RedisError(400, "match has already started by the host");

      roomDataGmSte["matchId"] = crypto.randomUUID();
      roomDataGmSte.gameStatus = gameStatus.THREE;

      await redisClient.setToRedis(roomDataGmSte.roomId, roomDataGmSte);
      await redisClient.setToRedis(roomDataGmSte.gameId, roomDataGmSte);

      clientSocket.in([...clientSocket.rooms]).emit("MESSAGE", {
        message: "match started by host",
        ...roomDataGmSte,
      });
      return;
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
      clientSocket.emit("ERROR", error?.message);
    }
  }

  async onSetBetAmount(clientSocket: Socket, data: IBetData[]): Promise<any> {
    try {
      console.log(clientSocket.id, ":", clientSocket.data);

      const roomGameState: IGameState = await redisClient.getFromRedis(
        clientSocket.data.roomId
      );

      if (!roomGameState)
        throw new RedisError(404, "room with roomId not found");

      if (!roomGameState.userIds?.includes(clientSocket.data.userId))
        throw new RedisError(400, "user id not found in the room");

      const newPlayerState: IPlayerState = {
        ...clientSocket.data,
        userBet: data,
      };
      clientSocket.data = newPlayerState;

      for (let i = 0; i < roomGameState.playerStates.length; i++) {
        if (
          roomGameState.playerStates[i].socketId === newPlayerState.socketId // this must be replaced by userId after testing
        ) {
          roomGameState.playerStates[i] = newPlayerState;
        }
      }

      roomGameState.gameStatus = gameStatus.FOUR;

      await redisClient.setToRedis(roomGameState.roomId, roomGameState);
      await redisClient.setToRedis(roomGameState.gameId, roomGameState);

      clientSocket.to([...clientSocket.rooms]).emit("MESSAGE", {
        message: `user with userId: ${clientSocket.data.userId} placed bet`,
        ...roomGameState,
      });

      clientSocket.emit("MESSAGE", "bet placed successfully");
      console.log(clientSocket.data);
      return;
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
      clientSocket.emit("ERROR", error?.message);
    }
  }

  async onSpinWheel(clientSocket: Socket): Promise<any> {
    try {
      const roomGameState: IGameState = await redisClient.getFromRedis(
        clientSocket.data.roomId
      );

      if (!roomGameState)
        throw new RedisError(404, "room with roomid not found");

      if (!roomGameState.userIds.includes(clientSocket.data.userId))
        throw new RedisError(400, "room doesn't includes you");
    } catch (error: any) {
      console.error("error occured during onSpinReels :", error?.message);
      clientSocket.emit("ERROR", error?.message);
    }
  }

  async onExitMatch(clientSocket: Socket): Promise<any> {
    try {
    } catch (error: any) {
      console.error("error occured during onSetBetAmount :", error?.message);
      clientSocket.emit("ERROR", error?.message);
    }
  }

  async onMatchInfo(clientSocket: Socket) {
    try {
      if (!clientSocket.data?.roomId)
        throw new RedisError(400, "you've not joined any room with match");

      let matchInfo = await redisClient.getFromRedis(clientSocket.data.roomId);

      clientSocket.emit("MESSAGE", {
        message: "match and room info fetched successfully",
        ...matchInfo,
      });
    } catch (error: any) {
      console.error("error occured during onMatchInfo :", error?.message);
    }
  }

  onPlayerLeave(): void {}

  onPlayerLeaveMatch(): void {}

  onReJoinMatch(): void {}
}
