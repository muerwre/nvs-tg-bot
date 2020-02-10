import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public user_id: number;

  @Column({ type: "text" })
  public chat: string;
  
  @Column()
  public group_id: number;
  
  @Column({ type: "varchar"})
  public timestamp: number;
}
