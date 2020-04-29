import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
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
    // is user a publisher or a teacher?
    this.canManage = true;
    // get customer id from route
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('id');
      this.fetchSession();
    });

    // subscribe on behaviorSubject
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimeSession: RealtimeSession) => {
        this.session = realtimeSession;
        console.log(realtimeSession);
      }
    );
  }

  // triggers when Whiteboard has changed
  updateWhiteboard(updatedWhiteboard: WhiteboardInterface) {
    // title / defaultcolor changed
    if (
      this.session.whiteboard.title !== updatedWhiteboard.title ||
      this.session.whiteboard.defaultColor !== updatedWhiteboard.defaultColor
    ) {
      this.sessionService
        .updateWhiteboardData(updatedWhiteboard)
        .subscribe(() => {});
    }

    // card was added
    if (this.session.whiteboard.cards.length < updatedWhiteboard.cards.length) {
      console.log('create card');
      const cardsToCreate = updatedWhiteboard.cards.filter(
        newCards =>
          !this.session.whiteboard.cards
            .map(currentCards => currentCards.id)
            .includes(newCards.id)
      );
      this.sessionService.createCard(cardsToCreate[0], false);
    }

    // card was deleted
    if (this.session.whiteboard.cards.length > updatedWhiteboard.cards.length) {
      console.log('delete card');
    }

    // shelfCard was added
    if (
      this.session.whiteboard.shelfCards.length <
      updatedWhiteboard.shelfCards.length
    ) {
      console.log('create shelfcard');
    }

    // shelfCard was deleted
    if (
      this.session.whiteboard.shelfCards.length >
      updatedWhiteboard.shelfCards.length
    ) {
      console.log('delete shelfcard');
    }
  }

  // triggers when a Card recieved an update
  updateCard(updatedCard: CardInterface) {}

  private fetchSession() {
    this.sessionService.getSession(this.sessionId);
  }
}
