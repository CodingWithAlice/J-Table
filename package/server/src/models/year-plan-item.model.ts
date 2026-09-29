import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'year_plan_item',
  underscored: true,
  timestamps: true,
})
export class YearPlanItem extends Model<YearPlanItem> {
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: number;

  @Column({ type: DataType.INTEGER, field: 'plan_year' })
  planYear: number;

  @Column({ type: DataType.STRING(32), field: 'group_key' })
  groupKey: string;

  @Column({ type: DataType.INTEGER, field: 'sort_order', defaultValue: 0 })
  sortOrder: number;

  @Column(DataType.STRING(200))
  title: string;

  @Column(DataType.STRING(32))
  kind: string;

  @Column({ type: DataType.STRING(32), allowNull: true })
  scene: string | null;

  @Column({ type: DataType.INTEGER, field: 'ref_id', allowNull: true })
  refId: number | null;

  @Column({ type: DataType.DECIMAL(12, 2), field: 'target_value', allowNull: true })
  targetValue: string | null;
}
