import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Party {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("json")
  participants: { name: string; target?: string }[];

  @Column({ default: false })
  isComplete: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
