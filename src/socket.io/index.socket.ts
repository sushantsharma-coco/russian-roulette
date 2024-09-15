import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { RussianRoulette } from "../lib/classes/russianRoulette";
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

new RussianRoulette(russianRoulette);
new SlotMachine(slotMachine);
