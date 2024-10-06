export enum playerStatus {
  HOST,
  PLAYER,
}

export interface IRedisUser {
  token: string;
  socketId: string;
  amount: number;
  userName: string;
  userId: string;
  status: boolean;
  // roomId?: string | null;
  // matchId?: string;
  updatedAt?: Date;
}

export interface IGameState {
  roomId: String;
  gameId: string;
  userIds: string[];
  socketIds: string[];
  matchIds?: string[];
  currentMatchId?: string;
  playerStates: IPlayerState[];
  currentStep?: string;
  nextStep?: string;
}

export interface IPlayerState {
  userId: string;
  gameId: string;
  socketId: string;
  roomId: string;
  totalBalance: number;
  bet?: number | number[];
  betAmount?: number;
  winLooseAmt?: number;
  playerStatus?: playerStatus;
}

export interface GameSettings {
  gameId: number;
  gameName: string;
  gameType: number;
  winWithToken: number;
  gameLogicSetting: GameLogicSettings;
  playerMin: number;
  playerMax: number;
  status: boolean;
  event_timeouts: EventTimeouts;
}

interface GameLogicSettings {
  minBetAmount: number;
  maxBetAmount: number;
}

interface EventTimeouts {
  match_making: number;
  game_waiting: number;
  turn: number;
  result: number;
  winner: number;
  exit: number;
}
