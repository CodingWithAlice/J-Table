import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'ltn_serial_time',
  underscored: true,
  timestamps: true,
})
export class Serial extends Model<Serial> {
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.INTEGER)
  serialNumber: number;

  @Column(DataType.DATE)
  startTime: Date;

  @Column(DataType.DATE)
  endTime: Date;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.STRING)
  frontOverview: string;

  @Column(DataType.STRING)
  frontWellDone: string;

  @Column(DataType.STRING)
  toBeBetter: string;

  @Column(DataType.STRING)
  sleep: string;

  @Column(DataType.STRING)
  sport: string;

  @Column(DataType.STRING)
  movie: string;

  @Column(DataType.STRING)
  ted: string;

  @Column(DataType.STRING)
  read: string;

  @Column(DataType.STRING)
  improveMethods: string;

  @Column(DataType.STRING)
  wellDone: string;

  @Column(DataType.STRING)
  nextWeek: string;
}
