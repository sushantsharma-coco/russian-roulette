import { DisconnectReason, Namespace, Socket } from "socket.io";

export class SlotMachine {
  io: Namespace;

  constructor(serverSocket: Namespace) {
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
  }

  async onConnect(clientSocket: Socket) {
    console.log("++++++++++++CONNECTION++++++++++++");

    clientSocket.on("START_GAME", this.onStartGame.bind(this));

    clientSocket.on("SPIN_REELS", this.onSpinReels.bind(this));

    clientSocket.on("LOOP_MATCH", this.onLoopMatch.bind(this));

    clientSocket.on("EXIT_MATCH", this.onExitMatch.bind(this));

    clientSocket.on("disconnect", this.onDisconnect.bind(this));
  }

  async onStartGame(clientSocket: Socket) {
    console.log("clientSocket id", clientSocket.id, " start game");
  }

  async onSpinReels(clientSocket: Socket) {
    console.log("clientSocket id", clientSocket.id, " start game");
  }

  async onLoopMatch(clientSocket: Socket) {
    console.log("clientSocket id", clientSocket.id, " start game");
  }

  async onExitMatch(clientSocket: Socket) {
    console.log("clientSocket id", clientSocket.id, " start game");
  }

  async onDisconnect(reason: DisconnectReason, clientSocket: Socket) {
    console.log("user disconnected with socket.id  due to reason ", reason);
  }
}
