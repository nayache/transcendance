import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import {UserEntity} from './user.entity'

@Entity()
export class Avatar {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	number: number;

	@Column()
	file: string;

	@Column({type: 'bytea'})
	datafile: Buffer;

	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE'})
	@JoinColumn({name: 'userId'})
	user: UserEntity;

	@Column()
	userId: string;

	@Column({ type: "bool", default: true })
	Current: boolean;
}

