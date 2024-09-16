import { Namespace, Socket } from "socket.io";

export class Poker {
  io: Namespace;

  constructor(serverSocket: Namespace) {
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
  }

  async onConnect(clientSocket: Socket) {
    try {
      console.log("+++++++++CONNECTION+++++++++");

      clientSocket.on("START_MATCH", this.onStartGame.bind(this));
    } catch (error: any) {
      console.error("error in onConnect", error?.message);
    }
  }

  async onStartGame(clientSocket: Socket) {}
}
