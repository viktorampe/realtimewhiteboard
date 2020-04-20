import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  }

  private fetchSession() {
    this.sessionService
      .getSession(this.sessionId)
      .subscribe((session: RealtimeSession) => {
        this.session = session;
        console.log(session);
      });
  }
}
