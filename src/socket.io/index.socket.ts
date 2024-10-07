import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Roulette } from "../lib/classes/roulette";
import { SlotMachine } from "../lib/classes/slotMachine";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

export const roulette = io.of("/roulette");
export const slotMachine = io.of("/slot-machine");

new Roulette(roulette);
// new SlotMachine(slotMachine);
