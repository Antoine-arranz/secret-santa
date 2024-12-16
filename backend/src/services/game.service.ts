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
    party.couples = couples;
    party.date = new Date();
    party.participantStatus = participants.map(name => ({
      name,
      hasJoined: false,
      hasDrawn: false
    }));

    const savedParty = await this.partyRepository.save(party);

    return this.partyToGame(savedParty);
  }

  async getGame(gameId: string): Promise<Game> {
    const party = await this.partyRepository.findOne({ where: { id: gameId } });
    if (!party) {
      throw new NotFoundException('Partie non trouvée');
    }

    return this.partyToGame(party);
  }

  async joinGame(gameId: string, joinGameDto: JoinGameDto): Promise<Game> {
    const party = await this.partyRepository.findOne({ where: { id: gameId } });
    if (!party) {
      throw new NotFoundException('Partie non trouvée');
    }

    const participantStatus = party.participantStatus.find(p => p.name === joinGameDto.name);
    if (!participantStatus) {
      throw new BadRequestException('Ce participant n\'est pas dans la liste');
    }

    if (participantStatus.hasJoined) {
      throw new BadRequestException('Ce participant a déjà rejoint la partie');
    }

    participantStatus.hasJoined = true;
    await this.partyRepository.save(party);

    return this.partyToGame(party);
  }

  async drawName(gameId: string, participantName: string): Promise<string> {
    const party = await this.partyRepository.findOne({ where: { id: gameId } });
    if (!party) {
      throw new NotFoundException('Partie non trouvée');
    }

    const participantStatus = party.participantStatus.find(p => p.name === participantName);
    if (!participantStatus) {
      throw new BadRequestException('Ce participant n\'est pas dans la liste');
    }

    if (!participantStatus.hasJoined) {
      throw new BadRequestException('Vous devez d\'abord rejoindre la partie');
    }

    if (participantStatus.hasDrawn) {
      if (party.assignments[participantName]) {
        return party.assignments[participantName];
      }
      throw new BadRequestException('Vous avez déjà tiré un nom');
    }

    // Liste des participants disponibles (non tirés)
    const assignedNames = Object.values(party.assignments || {});
    const availableParticipants = party.participants.filter(p => {
      // Ne peut pas se tirer soi-même
      if (p === participantName) return false;
      
      // Ne peut pas tirer quelqu'un qui a déjà été tiré
      if (assignedNames.includes(p)) return false;
      
      // Ne peut pas tirer son/sa partenaire
      const isCouple = party.couples.some(
        couple => 
          (couple.person1 === participantName && couple.person2 === p) ||
          (couple.person2 === participantName && couple.person1 === p)
      );
      return !isCouple;
    });

    if (availableParticipants.length === 0) {
      throw new BadRequestException('Plus de participants disponibles');
    }

    // Tirage aléatoire
    const drawnName = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
    
    // Mise à jour des assignments et du statut
    party.assignments = {
      ...party.assignments,
      [participantName]: drawnName
    };
    participantStatus.hasDrawn = true;

    await this.partyRepository.save(party);
    return drawnName;
  }

  private partyToGame(party: Party): Game {
    return {
      id: party.id,
      adminName: party.name,
      participants: party.participantStatus.map(p => ({
        name: p.name,
        hasJoined: p.hasJoined,
        hasDrawn: p.hasDrawn
      })),
      couples: party.couples || [],
      draws: new Map(Object.entries(party.assignments || {}))
    };
  }
}
