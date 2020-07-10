import {
    Model,
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    AllowNull,
    Unique,
    DataType,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript';
import crypto from 'crypto';

@Table({
    tableName: 'User'
})
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    // 注意，列信息要写在最后
    @Column
    id: number;

    @AllowNull(false)
    @Unique(true)
    @Column({
        type: DataType.STRING(50)
    })
    name: string;

    @Column
    set password(val: string) {
        let md5 = crypto.createHash('md5');
        let newPassword = md5.update(val).digest('hex');
        this.setDataValue('password', newPassword);
    };

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}