import { Socket } from "socket.io";
import { IRedisUser } from "../interfaces/states";
import { randomInt, randomUUID } from "crypto";
export class Operator {
  users: any = {};

  constructor(socket: Socket) {
    let user: IRedisUser = {
      token: randomUUID(),
      socketId: socket.id,
      amount: randomInt(1000, 10000),
      userName: socket.data.userName || "",
      userId: socket.data.userId,
      status: true,
      updatedAt: new Date(),
    };

    this.users[user.userId] = user;
  }

  getUser(userId: string): IRedisUser {
    return this.users[userId];
  }
}
