import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Roulette } from "../lib/classes/roulette";
import { SlotMachine } from "../lib/classes/slotMachine";

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

export const russianRoulette = io.of("/russian-roulette");
export const slotMachine = io.of("/slot-machine");

new Roulette(russianRoulette);
new SlotMachine(slotMachine);
