import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'ltn_topic_list',
  underscored: true,
  timestamps: true,
})
export class Ltn extends Model<Ltn> {
  @Column
  title: string;

  @Column
  source: number;

  @Column
  customDuration: number;

  @Column({ defaultValue: 1 })
  boxId: number;

  @Column({ defaultValue: 3 })
  levelId: number;

  @Column
  solveTime: Date;
}
