import mongoose from "mongoose";
import { ISlotGameState } from "../interfaces/states";

const slotGameStateSchema = new mongoose.Schema<ISlotGameState>({
  userId: { type: String, required: true },
  gameId: { type: String, required: true },
  socketId: { type: String, required: true },
  roomId: { type: String, required: true },
  walletBalance: { type: Number, required: true },
  betAmt: { type: Number, required: true },
  winAmt: { type: Number, required: true },
  looseAmt: { type: Number, required: true },
  currentStep: { type: String, required: true },
  nextStep: { type: String, required: true },
});

export const SlotGameState = mongoose.model(
  "SlotGameState",
  slotGameStateSchema
);
