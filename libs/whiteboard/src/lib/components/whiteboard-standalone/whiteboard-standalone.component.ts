import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import WhiteboardInterface from '../../models/whiteboard.interface';
import { WhiteboardHttpService } from '../../services/whiteboard-http.service';
import {
  CardImageUploadInterface,
  CardImageUploadResponseInterface
} from '../whiteboard/whiteboard.component';

@Component({
  selector: 'campus-whiteboard-standalone',
  templateUrl: './whiteboard-standalone.component.html',
  styleUrls: ['./whiteboard-standalone.component.scss']
})
export class WhiteboardStandaloneComponent implements OnChanges {
  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;
  @Input() canManage: boolean;

  whiteboard$: Observable<WhiteboardInterface>;
  uploadImageResponse$ = new BehaviorSubject<CardImageUploadResponseInterface>(
    null
  );

  constructor(private whiteboardHttpService: WhiteboardHttpService) {
    console.log('constructed');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('in on changes', changes);
    if (this.apiBase && this.eduContentMetadataId && this.canManage) {
      this.whiteboardHttpService.setSettings({
        apiBase: this.apiBase,
        metadataId: this.eduContentMetadataId
      });
      this.initialize();
    }
  }

  private initialize(): void {
    console.log('initialize');
    this.whiteboard$ = this.whiteboardHttpService.getJson();
  }

  saveWhiteboard(data: WhiteboardInterface): void {
    // check for permissions
    if (this.canManage) {
      console.log('saving', data);
      this.whiteboardHttpService
        .setJson(data)
        .pipe(take(1))
        .subscribe();
    } else {
      console.log('You are not authorized to save.');
    }
  }

  uploadImageForCard(cardImage: CardImageUploadInterface): void {
    if (this.canManage) {
      this.whiteboardHttpService
        .uploadFile(cardImage.imageFile)
        .pipe(
          map(response => {
            return this.uploadImageResponse$.next({
              card: cardImage.card,
              image: response
            });
          })
        )
        .subscribe(
          value => console.log(value),
          err => console.log(err),
          () => console.log('complete')
        );
    } else {
      console.log('You are not authorized to upload an image.');
    }
  }
}
