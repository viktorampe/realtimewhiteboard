import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
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
  session: RealtimeSession;
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
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // get session id from route
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('id');
      this.fetchSession();
    });

    // subscribe on session behaviorsubject  updates
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimeSession: RealtimeSession) => {
        this.session = realtimeSession;
      }
    );
    // Subscribe on active Playyer and update ui depending on active player
    this.activePlayerService.activePlayer$.subscribe((player: Player) => {
      console.log('active player: ', player);
      this.activePlayer = player;
      this.handleUI();
    });
    // subscribe on notifications from sessionService
    this.sessionService.notificationSetter$.subscribe((message: string) => {
      if (message) {
        this.openSnackBar(message);
      }
    });
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
      this.sessionService.createCard(cardsToCreate[0], this.activePlayer);
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
  updateCard(updatedCard: CardInterface) {
    this.sessionService.updateCard(updatedCard, this.activePlayer);
  }

  updateCardImage(cardImageUpload: CardImageUploadInterface) {
    const { card, imageFile } = cardImageUpload;
    // save image in S3 bucket
    this.sessionService.uploadFileTEST(imageFile).subscribe(response => {
      // get image from S3 bucket
      this.sessionService.downloadFile(response.key).subscribe(() => {
        const imageUrl = `https://realtimewhiteboardstragebucket125040-dev.s3-eu-west-1.amazonaws.com/public/${response.key}`;
        this.sessionService.updateCardImage(
          this.session.whiteboard.cards.find(c => (c.id = card.id)),
          imageUrl
        );
      });
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

  private openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000
    });
  }
}
