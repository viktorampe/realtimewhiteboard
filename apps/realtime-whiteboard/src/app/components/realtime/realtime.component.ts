import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import RealtimeSession from '../../models/realtimesession';
import { RealtimeSessionService } from '../../services/realtime-session.service';

@Component({
  selector: 'campus-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {
  sessionId: string;
  session: RealtimeSession;
  canManage: boolean;

  constructor(
    private sessionService: RealtimeSessionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.canManage = false;
    // get customer id from route
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('id');
      this.fetchSession();
    });

    // subscribe on session updates
    this.sessionService.subscribeOnSessionUpdates();
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimeSession: RealtimeSession) => {
        this.session = realtimeSession;
      }
    );
  }

  // triggers when Whiteboard has changed
  updateWhiteboard(updatedWhiteboard: WhiteboardInterface) {
    this.sessionService.updateWhiteboardData(updatedWhiteboard);
  }

  /*
  private fetchSession() {
    this.sessionService
      .getSession(this.sessionId)
      .subscribe((session: RealtimeSession) => {
        this.sessionService
          .getPlayersBySession(session.id)
          .subscribe((players: Player[]) => {
            session.players = players;
            this.session = session;
          });
      });
  }
  */

  private fetchSession() {
    this.sessionService.getSession(this.sessionId);
  }
}
