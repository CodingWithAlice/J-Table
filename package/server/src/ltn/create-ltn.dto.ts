export class CreateLtnDTO {
  id: string | number;
  type: 'update' | 'degrade' | 'fresh';
  time: string;
}

export class ListAllEntities {
  start?: string;
  end?: string;
  useMinDate?: boolean; // 是否使用最小日期查询
}
