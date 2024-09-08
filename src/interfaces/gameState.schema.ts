export interface IGameState extends Document {
  userId: string;
  gameId: string;
  socketId: string;
  roomId: String;
  walletBalance: number;
  betAmt: number;
  winAmt: number;
  looseAmt: number;
  currentStep: string;
  nextStep: string;
}
