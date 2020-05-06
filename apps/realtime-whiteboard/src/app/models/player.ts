export default class Player {
  id: string;
  sessionId: string;
  fullName: string;
  isTeacher: boolean;

  constructor(playerResponse: any) {
    this.id = playerResponse.id;
    this.sessionId = playerResponse.sessionId;
    this.fullName = playerResponse.fullName;
    this.isTeacher = playerResponse.isTeacher;
  }
}
