import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'ltn_data',
  underscored: true,
  timestamps: true,
})
export class Ltn extends Model<Ltn> {
  @Column
  title: string;

  @Column
  source: number;

  @Column({ defaultValue: 1 })
  boxId: number;

  @Column
  solveTime: Date;
}
