export enum AssigneeTypesEnum {
  CLASSGROUP = 'classgroup',
  GROUP = 'group',
  STUDENT = 'student'
}

export interface AssigneeInterface {
  type: AssigneeTypesEnum;
  label: string;
  start: Date;
  end: Date;
}
