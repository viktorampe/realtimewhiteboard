export default class Player {
  id: string;
  sessionId: string;
  fullName: string;
  isTeacher: boolean;

  constructor(playerResponse?: any) {
    this.id = playerResponse ? playerResponse.id : null;
    this.sessionId = playerResponse ? playerResponse.sessionID : null;
    this.fullName = playerResponse ? playerResponse.fullName : null;
    this.isTeacher = playerResponse ? playerResponse.isTeacher : null;
  }
}
