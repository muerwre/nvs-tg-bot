import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public user_id: number;

  @Column({ type: "text" })
  public chat_id: string;
  
  @Column()
  public message_id: number;
  
  @Column()
  public emo_id: number;
}