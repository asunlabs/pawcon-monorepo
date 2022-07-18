import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('artwork') // table name
export class ArtworkEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        comment: 'artwork id',
    })
    id: number;

    // a list of columns to describe artwork
    @Column({
        type: 'varchar',
    })
    name: string;
}
