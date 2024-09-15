import { DisconnectReason, Namespace, Socket } from "socket.io";
import { redisClient } from "../cache/redisClient";
import { randomUUID } from "crypto";

export class SlotMachine {
  io: Namespace;

  constructor(serverSocket: Namespace) {
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
  }

  async onConnect(clientSocket: Socket) {
    console.log("++++++++++++CONNECTION++++++++++++");

    let { id } = clientSocket.handshake.query;
    if (!id) {
      clientSocket.emit("ERROR", "USER ID NOT FOUND");
      return;
    }

    clientSocket.data["id"] = id;

    clientSocket.on("START_GAME", this.onStartGame.bind(this, clientSocket));

    clientSocket.on("SPIN_REELS", this.onSpinReels.bind(this, clientSocket));

    clientSocket.on("LOOP_MATCH", this.onLoopMatch.bind(this, clientSocket));

    clientSocket.on("EXIT_MATCH", this.onExitMatch.bind(this, clientSocket));

    clientSocket.on("disconnect", this.onDisconnect.bind(clientSocket));
  }

  async onStartGame(clientSocket: Socket) {
    try {
      // request to operator for details
      // let response = await fetch("https://operator", {
      //   headers: {
      //     Authorization: "",
      //     // other clients details
      //   },
      // });

      // if (!response)
      //   this.errorMessageEmmiter(
      //     clientSocket,
      //     "unable to get response from the operator"
      //   );

      let userkey = `user:${clientSocket.data.id}`;
      let userDetails = await redisClient.getFromRedis(userkey);

      if (!userDetails || !userDetails.userId)
        this.errorMessageEmmiter(
          clientSocket,
          "user details not found in redis"
        );

      let gameId = randomUUID();

      clientSocket.data = {
        ...userDetails,
        gameId,
        socketId: clientSocket.id,
        currentStep: "START_GAME",
        nextStep: "SPIN_REELS",
      };

      let gamekey = `slot-machine:gameState:${clientSocket.data.gameId}`;

      let res = await redisClient.setToRedis(gamekey, clientSocket.data);

      if (!res)
        this.errorMessageEmmiter(
          clientSocket,
          "unable to set game state to redis"
        );

      this.successMessageEmmiter(clientSocket, {
        message: "new game initialized successfully",
        ...clientSocket.data,
      });

      return;
    } catch (error: any) {
      console.error("error in start:", error?.message);
      this.errorMessageEmmiter(clientSocket, error?.message);
    }
  }

  async onSpinReels(clientSocket: Socket) {
    try {
      console.log("clientSocket id", clientSocket.id, " SPIN game");
    } catch (error: any) {
      console.error("error in start:", error?.message);
    }
  }

  async onLoopMatch(clientSocket: Socket) {
    try {
      console.log("clientSocket id", clientSocket.id, " LOOP game");
    } catch (error: any) {
      console.error("error in start:", error?.message);
    }
  }

  async onExitMatch(clientSocket: Socket) {
    try {
      console.log("clientSocket id", clientSocket.id, " EXIT game");
    } catch (error: any) {
      console.error("error in start:", error?.message);
    }
  }

  async onDisconnect(reason: DisconnectReason, clientSocket: Socket) {
    try {
      console.log(
        "user disconnected with socket.id  due to reason ",
        clientSocket.id,
        reason
      );
    } catch (error: any) {
      console.error("error in disconnection:", error?.message);
    }
  }

  successMessageEmmiter(clientSocket: Socket, message: string) {
    clientSocket.emit("MESSAGE", message);
  }

  errorMessageEmmiter(clientSocket: Socket, message: string) {
    clientSocket.emit("ERROR", message);
  }
}
