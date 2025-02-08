import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'ltn_cycle_list',
  underscored: true,
  timestamps: true,
})
export class Time extends Model<Time> {
  @Column
  routineTypeId: number;

  @Column
  serialNumber: number;

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
