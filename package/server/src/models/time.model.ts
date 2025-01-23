import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'ltn_time',
  underscored: true,
  timestamps: true,
})
export class Time extends Model<Time> {
  @Column
  routineTypeId: number;

  @Column
  ltnId: number;

  @Column
  des: string;

  @Column
  duration: string;

  @Column
  date: Date;

  @Column
  ltnWrong: boolean;

  @Column
  gap: number;
}
