import { Namespace, Socket } from "socket.io";

// total states 3:
// player state
// game state
// room state

export class Poker {
  io: Namespace;

  constructor(serverSocket: Namespace) {
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
  }

  async onConnect(clientSocket: Socket) {
    try {
      console.log("+++++++++CONNECTION+++++++++");

      clientSocket.on("ROOM_CREATE", this.onRoomCreate.bind(this));

      clientSocket.on("START_MATCH", this.onStartGame.bind(this));

      clientSocket.on("CALL", this.onCall.bind(this));

      clientSocket.on("CHECK", this.onCheck.bind(this));

      clientSocket.on("FOLD", this.onFold.bind(this));

      clientSocket.on("RAISE", this.onRaise.bind(this));
    } catch (error: any) {
      console.error("error in onConnect", error?.message);
    }
  }

  async onRoomCreate(clientSocket: Socket) {
    try {
    } catch (error: any) {
      console.error("error in room create", error?.message);
    }
  }

  async onStartGame(clientSocket: Socket) {}

  async onCall(clientSocket: Socket) {}

  async onCheck(clientSocket: Socket) {}

  async onFold(clientSocket: Socket) {}

  async onRaise(clientSocket: Socket) {}

  errorEmitter(clientSocket: Socket, errorMessage: string) {
    clientSocket.emit("ERROR", errorMessage);
  }

  messageEmitter(clientSocket: Socket, message: string) {
    clientSocket.emit("MESSAGE", message);
  }
}
