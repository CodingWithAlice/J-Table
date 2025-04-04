import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'ltn_topic_level',
  underscored: true,
  timestamps: false,
})
export class Level extends Model<Level> {
  @Column
  desc: string;

  @Column
  basicDuration: number;

  @Column
  maxDuration: number;
}
