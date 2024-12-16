import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column('simple-json', { nullable: true })
  assignments: { [key: string]: string };
}
