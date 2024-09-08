import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { RussianRoulette } from "../lib/classes/russianRoulette";

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

export const russianRoulette = io.of("/russian-roulette");

new RussianRoulette(russianRoulette);
