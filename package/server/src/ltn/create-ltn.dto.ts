export class CreateLtnDTO {
  id: string | number;
  type: 'update' | 'degrade' | 'fresh';
  time: string;
}

export class ListAllEntities {
  start: string;
  end: string;
}
