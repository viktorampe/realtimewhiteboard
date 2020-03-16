import { AssigneeInterface } from '@campus/dal';

export interface ManageKabasTasksAssigneeDataInterface {
  title: string;
  isPaperTask: boolean;

  // all possible values, based on store values
  possibleTaskClassGroups: AssigneeInterface[];
  possibleTaskGroups: AssigneeInterface[];
  possibleTaskStudents: AssigneeInterface[];

  // current values in page
  currentTaskAssignees: AssigneeInterface[];
}
