import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import "reflect-metadata"

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public chat: string;
  
  @Column({ nullable: true })
  public chat_id: string;
  
  @Column({ nullable: true })
  public message_id: number;
  
  @Column({ nullable: true })
  public group_id: number;
  
  @Column({ nullable: true })
  public post_id: number;
  
  @Column()
  public is_cutted: boolean;
  
  @Column({ nullable: true })
  public map_url: string;
  
  @Column({ nullable: true })
  public post_url: string;
  
  @Column({ nullable: true })
  public album_url: string;
  
  @Column({ nullable: true })
  public topic_url: string;
}