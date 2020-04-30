import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { RealtimeCard } from '../../models/realtimecard';
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
    this.canManage = false;
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
      console.log('updateWhiteboard');
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
      this.sessionService.createCard(cardsToCreate[0]);
    }

    // card was deleted
    if (this.session.whiteboard.cards.length > updatedWhiteboard.cards.length) {
      console.log('delete card');
      const cardToDelete = this.session.whiteboard.cards.filter(
        currentCard =>
          !updatedWhiteboard.cards.map(c => c.id).includes(currentCard.id)
      );
      this.sessionService.deleteCard(cardToDelete[0]);
    }
  }

  // triggers when a Card recieved an update
  updateCard(updatedCard: RealtimeCard) {
    console.log('update card');
    this.sessionService.updateCard(updatedCard);
  }

  private fetchSession() {
    this.sessionService.getSession(this.sessionId);
  }
}
