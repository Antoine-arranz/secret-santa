import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, Participant, Couple, CreateGameDto, JoinGameDto } from '../models/game.model';
import { Party } from '../entities/party.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Party)
    private partyRepository: Repository<Party>
  ) {}

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const { adminName, participants, couples } = createGameDto;

    // Vérifier que tous les participants des couples sont dans la liste des participants
    for (const couple of couples) {
      if (!participants.includes(couple.person1) || !participants.includes(couple.person2)) {
        throw new BadRequestException('Les membres du couple doivent être dans la liste des participants');
      }
    }

    const party = new Party();
    party.name = adminName;
    party.participants = participants;
    party.assignments = {};
    party.date = new Date();

    const savedParty = await this.partyRepository.save(party);

    const game: Game = {
      id: savedParty.id,
      adminName,
      participants: participants.map(name => ({
        name,
        hasJoined: false,
        hasDrawn: false
      })),
      couples,
      draws: new Map()
    };

    return game;
  }

  async getGame(gameId: string): Promise<Game> {
    const party = await this.partyRepository.findOne({ where: { id: gameId } });
    if (!party) {
      throw new NotFoundException('Partie non trouvée');
    }

    // Convertir les données de la base en format Game
    const game: Game = {
      id: party.id,
      adminName: party.name,
      participants: party.participants.map(name => ({
        name,
        hasJoined: true,
        hasDrawn: !!party.assignments[name]
      })),
      couples: [], // À implémenter si nécessaire
      draws: new Map(Object.entries(party.assignments || {}))
    };

    return game;
  }

  async joinGame(gameId: string, joinGameDto: JoinGameDto): Promise<Game> {
    const party = await this.partyRepository.findOne({ where: { id: gameId } });
    if (!party) {
      throw new NotFoundException('Partie non trouvée');
    }

    if (!party.participants.includes(joinGameDto.name)) {
      throw new BadRequestException('Ce participant n\'est pas dans la liste');
    }

    return this.getGame(gameId);
  }

  async drawName(gameId: string, participantName: string): Promise<string> {
    const party = await this.partyRepository.findOne({ where: { id: gameId } });
    if (!party) {
      throw new NotFoundException('Partie non trouvée');
    }

    if (!party.participants.includes(participantName)) {
      throw new BadRequestException('Ce participant n\'est pas dans la liste');
    }

    if (party.assignments && party.assignments[participantName]) {
      return party.assignments[participantName];
    }

    // Liste des participants disponibles (non tirés)
    const assignedNames = Object.values(party.assignments || {});
    const availableParticipants = party.participants.filter(
      p => p !== participantName && !assignedNames.includes(p)
    );

    if (availableParticipants.length === 0) {
      throw new BadRequestException('Plus de participants disponibles');
    }

    // Tirage aléatoire
    const drawnName = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
    
    // Mise à jour des assignments
    party.assignments = {
      ...party.assignments,
      [participantName]: drawnName
    };

    await this.partyRepository.save(party);
    return drawnName;
  }
}
