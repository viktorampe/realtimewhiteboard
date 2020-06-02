import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CardImageUploadInterface,
  CardImageUploadResponseInterface
} from 'libs/whiteboard/src/lib/components/whiteboard/whiteboard.component';
import { CardInterface } from 'libs/whiteboard/src/lib/models/card.interface';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { BehaviorSubject } from 'rxjs';
import Player from '../../models/player';
import RealtimeSession from '../../models/realtimesession';
import { RealtimeWhiteboard } from '../../models/realtimewhiteboard';
import { ActiveplayerService } from '../../services/activeplayer/activeplayer.service';
import { FullscreenService } from '../../services/fullscreen/fullscreen.service';
import { RealtimeSessionService } from '../../services/realtimesession/realtime-session.service';
import { UpdateHelper } from '../../util/updateHelper';

@Component({
  selector: 'campus-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss'],
  providers: []
})
export class RealtimeComponent implements OnInit {
  sessionId: string;

  session$ = new BehaviorSubject<RealtimeSession>(null);
  whiteboard$ = new BehaviorSubject<RealtimeWhiteboard>(null);

  loggedIn: boolean;
  activePlayer: Player;
  message: string;

  imageUploadResponse$ = new BehaviorSubject<CardImageUploadResponseInterface>(
    null
  );

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

    // subscribe on session behaviorsubject updates
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimeSession: RealtimeSession) => {
        if (realtimeSession) {
          this.setBehaviorSubjects(realtimeSession);
        }
      }
    );
    // Subscribe on active Player and update ui depending on active player
    this.activePlayerService.activePlayer$.subscribe((player: Player) => {
      this.activePlayer = player;
      this.handleUI();
    });
  }

  joinSession(playerAndPincode: { player: Player; pincode: number }) {
    const { player, pincode } = playerAndPincode;
    if (pincode === this.session$.getValue().pincode) {
      // post player
      this.sessionService
        .createPlayer(player)
        .subscribe((newPlayer: Player) => {
          // set new player as active player
          this.activePlayerService.setActivePlayer(newPlayer);
        });
    } else {
      this.message = 'Incorrect pincode';
    }
  }

  // triggers when Whiteboard has changed
  updateWhiteboard(updatedWhiteboard: WhiteboardInterface) {
    // get update type
    const update = UpdateHelper.handleWhiteboardUpdate(
      this.whiteboard$.getValue(),
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
          !this.whiteboard$
            .getValue()
            .cards.map(currentCards => currentCards.id)
            .includes(newCards.id)
      );
      this.sessionService.createCard(cardsToCreate[0], this.activePlayer);
    }

    // card was deleted
    if (update.includes('DELETE_CARD')) {
      const cardsToDelete = this.whiteboard$
        .getValue()
        .cards.filter(
          currentCard =>
            !updatedWhiteboard.cards.map(c => c.id).includes(currentCard.id)
        );
      cardsToDelete.forEach(c => this.sessionService.deleteCard(c));
    }
  }

  // triggers when a Card recieved an update
  updateCard(updatedCard: CardInterface) {
    this.sessionService.updateCard(updatedCard, this.activePlayer);
  }

  updateCardImage(cardImageUpload: CardImageUploadInterface) {
    const { card, imageFile } = cardImageUpload;
    this.sessionService.uploadFile(imageFile).subscribe((image: any) => {
      this.sessionService.updateCardImage(
        this.whiteboard$.getValue().cards.find(c => c.id === card.id),
        image.imageUrl
      );
    });
  }

  private fetchSession() {
    this.sessionService.getSession(this.sessionId);
  }

  private handleUI() {
    if (this.activePlayer !== null) {
      this.loggedIn = true;
      if (!this.activePlayer.isTeacher) {
        this.fullscreenService.setFullscreen(true);
      }
    } else {
      this.loggedIn = false;
      this.fullscreenService.setFullscreen(true);
    }
  }

  private setBehaviorSubjects(realtimeSession: RealtimeSession) {
    this.session$.next(realtimeSession);
    this.whiteboard$.next(Object.assign({}, realtimeSession.whiteboard));
  }
}
