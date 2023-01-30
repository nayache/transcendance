import { type } from 'os';
import { User } from 'src/decorators/user.decorator';
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
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	file: string;

	@Column({type: 'bytea'})
	datafile: Buffer;

	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE'})
	@JoinColumn()
	user: UserEntity;
}

