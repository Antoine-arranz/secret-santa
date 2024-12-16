export interface Game {
  id: string;
  adminName: string;
  participants: Participant[];
  couples: Couple[];
  draws: Map<string, string>; // key: participantName, value: drawnParticipantName
}

export interface Participant {
  name: string;
  hasJoined: boolean;
  hasDrawn: boolean;
}

export interface Couple {
  person1: string;
  person2: string;
}

export interface CreateGameDto {
  adminName: string;
  participants: string[];
  couples: { person1: string; person2: string; }[];
}

export interface JoinGameDto {
  name: string;
}
