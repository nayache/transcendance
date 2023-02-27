import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class MessageEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    author: string;

    @Column()
    content: string
}