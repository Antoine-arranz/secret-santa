import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Game, Participant, Couple, CreateGameDto, JoinGameDto } from '../models/game.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();

  createGame(createGameDto: CreateGameDto): Game {
    const { adminName, participants, couples } = createGameDto;

    // Vérifier que tous les participants des couples sont dans la liste des participants
    for (const couple of couples) {
      if (!participants.includes(couple.person1) || !participants.includes(couple.person2)) {
        throw new BadRequestException('Les membres du couple doivent être dans la liste des participants');
      }
    }

    const game: Game = {
      id: uuidv4(),
      adminName,
      participants: participants.map(name => ({
        name,
        hasJoined: false,
        hasDrawn: false
      })),
      couples,
      draws: new Map()
    };

    this.games.set(game.id, game);
    return game;
  }

  getGame(gameId: string): Game {
    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundException('Partie non trouvée');
    }
    return game;
  }

  joinGame(gameId: string, joinGameDto: JoinGameDto): Participant {
    const game = this.getGame(gameId);
    const participant = game.participants.find(p => p.name === joinGameDto.name);
    
    if (!participant) {
      throw new BadRequestException('Participant non trouvé dans cette partie');
    }

    if (participant.hasJoined) {
      throw new BadRequestException('Participant déjà connecté');
    }

    participant.hasJoined = true;
    return participant;
  }

  drawName(gameId: string, participantName: string): string {
    const game = this.getGame(gameId);
    const participant = game.participants.find(p => p.name === participantName);

    if (!participant) {
      throw new BadRequestException('Participant non trouvé');
    }

    if (!participant.hasJoined) {
      throw new BadRequestException('Vous devez d\'abord rejoindre la partie');
    }

    if (participant.hasDrawn) {
      throw new BadRequestException('Vous avez déjà tiré un nom');
    }

    const availableParticipants = game.participants.filter(p => {
      // Ne peut pas se tirer soi-même
      if (p.name === participantName) return false;
      
      // Ne peut pas tirer quelqu'un qui a déjà été tiré
      if ([...game.draws.values()].includes(p.name)) return false;
      
      // Ne peut pas tirer son/sa partenaire
      const isCouple = game.couples.some(
        couple => 
          (couple.person1 === participantName && couple.person2 === p.name) ||
          (couple.person2 === participantName && couple.person1 === p.name)
      );
      return !isCouple;
    });

    if (availableParticipants.length === 0) {
      throw new BadRequestException('Aucun participant disponible pour le tirage');
    }

    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
    const drawnParticipant = availableParticipants[randomIndex];
    
    game.draws.set(participantName, drawnParticipant.name);
    participant.hasDrawn = true;

    return drawnParticipant.name;
  }
}
