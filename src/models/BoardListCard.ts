import {
    Model,
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    ForeignKey,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany
} from 'sequelize-typescript';
import { User } from './User';
import { BoardList } from './BoardList';
import { CardAttachment } from './CardAttachment';
import { Comment } from './Comment';

@Table({
    tableName: 'BoardListCard'
})
export class BoardListCard extends Model<BoardListCard> {
    
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    userId: number;

    @ForeignKey(() => BoardList)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    boardListId: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: false,
        defaultValue: ''
    })
    description: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0
    })
    order: number;

    @HasMany(() => CardAttachment)
    attachments: CardAttachment[];

    @HasMany(() => Comment)
    comments: Comment[];

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}