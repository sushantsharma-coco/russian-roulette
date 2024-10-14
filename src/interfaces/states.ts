export enum playerStatus {
  host = "HOST",
  player = "PLAYER",
}

export enum gameStatus {
  ONE = "ROOM_CREATE",
  TWO = "JOIN_ROOM",
  THREE = "START_MATCH",
  FOUR = "SET_BET",
  FIVE = "SPIN_WHEEL",
  SIX = "REPLAY_MATCH",
  SEVEN = "EXIT_MATCH",
}

export enum EBetTypes {
  SINGLE = "SINGLE",
  ODD = "ODD",
  EVEN = "EVEN",
  RED = "RED",
  BLACK = "BLACK",
  ZERO = "ZERO",
  DOUBLE_ZERO = "DOUBLE_ZERO",
  SPLIT = "SPLIT",
  CORNER = "CORNER",
  LINE = "LINE",
  FIRST12 = "FIRST12",
  SECOND12 = "SECOND12",
  THIRD12 = "THIRD12",
  LOW = "LOW",
  HIGH = "HIGH",
  FIRST_COLUMN = "FIRST_COLUMN",
  SECOND_COLUMN = "SECOND_COLUMN",
  THIRD_COLUMN = "THIRD_COLUMN",
}

export enum EPayouts {
  SINGLE = 35,
  ODD = 1,
  EVEN = 1,
  RED = 1,
  BLACK = 1,
  ZERO = 35,
  DOUBLE_ZERO = 35,
  SPLIT = 17,
  CORNER = 8,
  LINE = 5,
  FIRST12 = 2,
  SECOND12 = 2,
  THIRD12 = 2,
  LOW = 1,
  HIGH = 1,
  FIRST_COLUMN = 2,
  SECOND_COLUMN = 2,
  THIRD_COLUMN = 2,
}

export interface IRedisUser {
  token: string;
  socketId: string;
  amount: number;
  userName: string;
  userId: string;
  status: boolean;
  roomId?: string | null;
  matchId?: string;
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
  gameStatus?: gameStatus;
}

export interface IBetData {
  betType: EBetTypes;
  betAmt: number;
  betNum: number | number[];
  resNum?: number;
  payout?: number;
}

export interface IPlayerState {
  userId: string;
  gameId: string;
  socketId: string;
  roomId: string;
  totalBalance: number;
  userBet?: IBetData[];
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
