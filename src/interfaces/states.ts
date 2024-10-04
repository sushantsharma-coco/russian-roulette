export interface IGameState {
  userId: string[];
  gameId: string;
  socketId: string[];
  roomId: String;
  totalBalance: number;
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
  totalBalance: number;
}
