import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'routine_type',
  underscored: true,
  timestamps: false,
})
export class Routine extends Model<Routine> {
  @Column
  type: string;

  @Column
  des: string;
}
