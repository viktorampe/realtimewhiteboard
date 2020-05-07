import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import Player from '../../models/player';
import { RealtimeCard } from '../../models/realtimecard';
import RealtimeSession from '../../models/realtimesession';
import { ActiveplayerService } from '../../services/activeplayer/activeplayer.service';
import { FullscreenService } from '../../services/fullscreen/fullscreen.service';
import { RealtimeSessionService } from '../../services/realtimesession/realtime-session.service';
import { UpdateHelper } from '../../util/updateHelper';

@Component({
  selector: 'campus-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {
  sessionId: string;
  session: RealtimeSession;
  loggedIn: boolean;
  message: string;

  constructor(
    private sessionService: RealtimeSessionService,
    private activePlayerService: ActiveplayerService,
    private fullscreenService: FullscreenService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // get session id from route
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('id');
      this.fetchSession();
    });

    // subscribe on behaviorSubject
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimeSession: RealtimeSession) => {
        this.session = realtimeSession;
      }
    );
    // Update ui depending on active player
    this.handleUI(this.activePlayerService.getActivePlayer());
  }

  joinSession(playerAndPincode: { player: Player; pincode: number }) {
    const { player, pincode } = playerAndPincode;
    if (pincode === this.session.pincode) {
      // post player
      this.sessionService
        .createPlayer(player)
        .subscribe((newPlayer: Player) => {
          // set new player as active player
          this.activePlayerService.setActivePlayer(newPlayer);
          // update ui to view realtimewhiteboard
          this.loggedIn = true;
        });
    } else {
      this.message = 'Incorrect pincode';
    }
  }

  // triggers when Whiteboard has changed
  updateWhiteboard(updatedWhiteboard: WhiteboardInterface) {
    // get update type
    const update = UpdateHelper.handleWhiteboardUpdate(
      this.session.whiteboard,
      updatedWhiteboard
    );
    // title / defaultcolor changed
    if (update.includes('UPDATE_WHITEBOARD')) {
      this.sessionService
        .updateWhiteboardData(updatedWhiteboard)
        .subscribe(() => {});
    }

    // card was added
    if (update.includes('CREATE_CARD')) {
      const cardsToCreate = updatedWhiteboard.cards.filter(
        newCards =>
          !this.session.whiteboard.cards
            .map(currentCards => currentCards.id)
            .includes(newCards.id)
      );
      UpdateHelper.prepareCard(cardsToCreate[0]);
      this.sessionService.createCard(cardsToCreate[0]);
    }

    // card was deleted
    if (update.includes('DELETE_CARD')) {
      const cardsToDelete = this.session.whiteboard.cards.filter(
        currentCard =>
          !updatedWhiteboard.cards.map(c => c.id).includes(currentCard.id)
      );
      cardsToDelete.forEach(c => this.sessionService.deleteCard(c));
    }
  }

  // triggers when a Card recieved an update
  updateCard(updatedCard: RealtimeCard) {
    console.log('update card');
    UpdateHelper.prepareCard(updatedCard);
    this.sessionService.updateCard(updatedCard);
  }

  private fetchSession() {
    this.sessionService.getSession(this.sessionId);
  }

  private handleUI(activePlayer: Player) {
    if (activePlayer !== null) {
      this.loggedIn = true;
    }
    if (activePlayer === null || !activePlayer.isTeacher) {
      this.fullscreenService.setFullscreen(true);
      this.loggedIn = false;
    }
  }
}
