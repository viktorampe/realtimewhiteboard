import { AssigneeInterface } from '../../interfaces/Assignee.interface';

export interface ManageKabasTasksAssigneeDataInterface {
  title: string;

  // all possible values, based on store values
  possibleTaskAssignees: AssigneeInterface[];

  // current values in page
  currentTaskAssignees: AssigneeInterface[];
}
