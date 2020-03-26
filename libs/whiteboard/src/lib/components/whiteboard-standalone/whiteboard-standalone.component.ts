import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { iconMap } from '../../icons/icon-mapping';
import CardInterface from '../../models/card.interface';
import WhiteboardInterface from '../../models/whiteboard.interface';
import { WhiteboardHttpService } from '../../services/whiteboard-http.service';
import { WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN } from '../../tokens/whiteboard-element-icon-mapping.token';
import {
  CardImageUploadInterface,
  CardImageUploadResponseInterface
} from '../whiteboard/whiteboard.component';

@Component({
  selector: 'campus-whiteboard-standalone',
  templateUrl: './whiteboard-standalone.component.html',
  styleUrls: ['./whiteboard-standalone.component.scss'],
  providers: [
    { provide: WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN, useValue: iconMap } // this component is used as angular-element, it can not resolve relative urls
  ]
})
export class WhiteboardStandaloneComponent implements OnChanges {
  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;
  @Input() canManage: boolean;

  whiteboard$: Observable<WhiteboardInterface>;

  title$: Observable<string>;
  cards$: Observable<CardInterface[]>;
  shelfCards$: Observable<CardInterface[]>;

  uploadImageResponse$ = new BehaviorSubject<CardImageUploadResponseInterface>(
    null
  );

  constructor(
    private whiteboardHttpService: WhiteboardHttpService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN)
    private iconMapping
  ) {
    this.setupIconRegistry();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.apiBase && this.eduContentMetadataId && this.canManage) {
      this.whiteboardHttpService.setSettings({
        apiBase: this.apiBase,
        metadataId: this.eduContentMetadataId
      });
      this.initialize();
    }
  }

  private initialize(): void {
    this.whiteboard$ = this.whiteboardHttpService.getJson().pipe(
      filter(whiteboard => !!whiteboard),
      shareReplay(1)
    );

    this.title$ = this.whiteboard$.pipe(map(whiteboard => whiteboard.title));
    this.cards$ = this.whiteboard$.pipe(
      map(whiteboard => (whiteboard.cards ? whiteboard.cards : []))
    );
    this.shelfCards$ = this.whiteboard$.pipe(
      map(whiteboard => (whiteboard.shelfCards ? whiteboard.shelfCards : []))
    );
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

  private setupIconRegistry() {
    for (const key in this.iconMapping) {
      if (key.indexOf(':') > 0) {
        this.iconRegistry.addSvgIconLiteralInNamespace(
          key.split(':')[0],
          key.split(':')[1],
          this.sanitizer.bypassSecurityTrustHtml(this.iconMapping[key])
        );
      } else {
        this.iconRegistry.addSvgIconLiteral(
          key,
          this.sanitizer.bypassSecurityTrustHtml(this.iconMapping[key])
        );
      }
    }
  }
}
