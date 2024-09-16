import { Socket } from "socket.io";
import { Namespace } from "socket.io";

export class TeenPatti {
  io: Namespace;

  constructor(serverSocket: Namespace) {
    this.io = serverSocket;

    this.io.on("connection", this.onConnect.bind(this));
  }

  async onConnect(clientSocket: Socket): Promise<any> {
    try {
      console.log("+++++++++++CONNECTION+++++++++++");
      console.log("client connected with socket id", clientSocket.id);

      clientSocket.on("START_MATCH", this.onStartMatch.bind(this));
    } catch (error: any) {
      console.error("error :", error?.message);
    }
  }

  async onStartMatch(clientSocket: Socket) {}
}
