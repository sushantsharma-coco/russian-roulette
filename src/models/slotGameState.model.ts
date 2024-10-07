import mongoose from "mongoose";
import { IGameState } from "../interfaces/states";

const slotGameStateSchema = new mongoose.Schema<IGameState>({
  currentMatchId: { type: String, required: true },
  gameId: { type: String, required: true },
  roomId: { type: String, required: true },
  matchIds: [{ type: String, required: true }],
  userIds: [{ type: String, required: true }],
  socketIds: [{ type: String, required: true }],
  playerStates: [{ type: Object, required: true }],
  currentStep: { type: String, required: true },
  nextStep: { type: String, required: true },
});

export const SlotGameState = mongoose.model(
  "SlotGameState",
  slotGameStateSchema
);
