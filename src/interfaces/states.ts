export interface ISlotGameState {
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

export interface IPlayerState {
  userId: string;
  gameId: string;
  socketId: string;
  roomId: string;
  walletBalance: number;
}
