import { AssigneeInterface } from '../../interfaces/Assignee.interface';

export interface ManageKabasTasksAssigneeDataInterface {
  title: string;

  classGroups: [];
  groups: [];
  students: [];

  // current values in page
  currentTaskAssignees: AssigneeInterface[];
}
