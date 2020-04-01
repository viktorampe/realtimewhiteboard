import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ModeEnum } from '../../enums/mode.enum';
import { iconMap } from '../../icons/icon-mapping';
import { CardInterface } from '../../models/card.interface';
import { WhiteboardInterface } from '../../models/whiteboard.interface';
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
export class WhiteboardStandaloneComponent implements OnChanges, OnInit {
  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;
  @Input() canManage: boolean;

  whiteboard$: Observable<WhiteboardInterface>;

  title$: Observable<string>;
  cards$: Observable<CardInterface[]>;
  shelfCards$: Observable<CardInterface[]>;
  defaultColor$: Observable<string>;

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

  ngOnInit(): void {
    this.setSourceStreams();
    this.setupPresentationStreams();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.apiBase && this.eduContentMetadataId) {
      this.whiteboardHttpService.setSettings({
        apiBase: this.apiBase,
        metadataId: this.eduContentMetadataId
      });
      this.setSourceStreams();
    }
  }

  private setSourceStreams(): void {
    this.whiteboard$ = this.whiteboardHttpService.getJson();
  }

  private setupPresentationStreams() {
    this.title$ = this.whiteboard$.pipe(map(whiteboard => whiteboard.title));
    this.cards$ = this.whiteboard$.pipe(
      map(whiteboard => []) // always start with an empty workspace
    );
    this.shelfCards$ = this.whiteboard$.pipe(
      map(whiteboard => {
        // all cards coming from the API should be added to the shelf
        return [...whiteboard.cards, ...whiteboard.shelfCards] || [];
      }),
      map(shelfCards => {
        return shelfCards.map(c => ({
          ...c,
          mode: ModeEnum.SHELF
        }));
      })
    );
    this.defaultColor$ = this.whiteboard$.pipe(
      map(whiteboard => whiteboard.defaultColor || '')
    );
  }

  saveWhiteboard(data: WhiteboardInterface): void {
    // check for permissions
    if (!this.canManage) return console.log('You are not authorized to save.');

    this.whiteboardHttpService
      .setJson(data)
      .pipe(take(1))
      .subscribe();
  }

  uploadImageForCard(cardImage: CardImageUploadInterface): void {
    if (!this.canManage)
      return console.log('You are not authorized to upload an image.');

    this.whiteboardHttpService
      .uploadFile(cardImage.imageFile)
      .subscribe(response => {
        return this.uploadImageResponse$.next({
          card: cardImage.card,
          image: response
        });
      });
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
