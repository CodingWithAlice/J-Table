import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'books_record',
  underscored: true,
  timestamps: true,
})
export class BooksRecord extends Model<BooksRecord> {
  @Column(DataType.DATE)
  recent: Date;

  @Column(DataType.DATE)
  lastTime: Date;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  record: string;

  @Column(DataType.STRING)
  blogUrl: string;

  @Column(DataType.STRING)
  tag: string;
}
