import { Column, Model, Table, DataType, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'ltn_daily_coins',
  underscored: true,
  timestamps: true,
})
export class Coin extends Model<Coin> {
  @Unique
  @Column(DataType.STRING)
  date: string;

  @Column(DataType.INTEGER)
  coins: number;
}

