import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

interface ParticipantStatus {
  name: string;
  hasJoined: boolean;
  hasDrawn: boolean;
}

@Entity()
export class Party {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column('simple-array')
  participants: string[];

  @Column('jsonb', { nullable: true })
  participantStatus: ParticipantStatus[];

  @Column('jsonb', { nullable: true })
  assignments: { [key: string]: string };

  @Column('jsonb', { nullable: true })
  couples: { person1: string; person2: string; }[];
}
