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
	file: string;

	@Column({type: 'bytea'})
	datafile: Buffer;

	@Column()
	mimetype: string;

	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE'})
	@JoinColumn({name: 'userId'})
	user: UserEntity;

	@Column()
	userId: string;
}

