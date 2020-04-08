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
import {
  FileReaderService,
  FileReaderServiceInterface,
  FILEREADER_SERVICE_TOKEN
} from '@campus/browser';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, take, takeUntil } from 'rxjs/operators';
import { ModeEnum } from '../../enums/mode.enum';
import { iconMap } from '../../icons/icon-mapping';
import { CardInterface } from '../../models/card.interface';
import ImageInterface from '../../models/image.interface';
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
    { provide: FILEREADER_SERVICE_TOKEN, useClass: FileReaderService },
    { provide: WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN, useValue: iconMap } // this component is used as angular-element, it can not resolve relative urls
  ]
})
export class WhiteboardStandaloneComponent implements OnChanges, OnInit {
  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;
  @Input() canManage: boolean;
  @Input() whiteboardData: WhiteboardInterface;

  private whiteboard$: Observable<WhiteboardInterface>;

  title$: Observable<string>;
  cards$: Observable<CardInterface[]>;
  shelfCards$: Observable<CardInterface[]>;
  defaultColor$: Observable<string>;

  imageUploadResponse$ = new BehaviorSubject<CardImageUploadResponseInterface>(
    null
  );

  constructor(
    private whiteboardHttpService: WhiteboardHttpService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN)
    private iconMapping,
    @Inject(FILEREADER_SERVICE_TOKEN)
    private fileReaderService: FileReaderServiceInterface
  ) {
    this.setupIconRegistry();
  }

  ngOnInit(): void {
    this.setSourceStreams();
    this.setPresentationStreams();
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
    if (this.whiteboardData && !this.canManage) {
      // work locally: the data object is made on the API side and changes to the data are not persisted in the DB
      // this is the case for teachers and students
      this.whiteboard$ = of(this.whiteboardData);
    } else {
      this.whiteboard$ = this.whiteboardHttpService.getJson();
    }
  }

  public uploadImageForCard(cardImage: CardImageUploadInterface): void {
    if (!this.canManage) {
      // if you don't have permission to manage, you should still be able to see images locally
      this.fileReaderService.readAsDataURL(cardImage.imageFile);

      const imageUrl$ = this.fileReaderService.loaded$.pipe(
        filter(imageUrl => !!imageUrl),
        map(imageUrl => ({
          card: cardImage.card,
          image: { imageUrl, progress: 100 } // loaded only emits when a read has completed successfully --> progress 100
        })),
        take(1)
      );
      const progress$ = this.fileReaderService.progress$.pipe(
        filter(progress => progress !== null),
        map(progress => ({
          card: cardImage.card,
          image: { progress }
        })),
        takeUntil(imageUrl$)
      );

      const uploadResponse$ = merge(progress$, imageUrl$); // merge completes when all input streams complete

      uploadResponse$.subscribe(uploadResponse => {
        this.imageUploadResponse$.next(uploadResponse);
      });
    } else {
      this.whiteboardHttpService
        .uploadFile(cardImage.imageFile)
        .subscribe(response => {
          return this.imageUploadResponse$.next({
            card: cardImage.card,
            image: response
          });
        });
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

  private setPresentationStreams() {
    this.title$ = this.whiteboard$.pipe(map(whiteboard => whiteboard.title));
    this.cards$ = this.whiteboard$.pipe(
      mapTo([]) // always start with an empty workspace
    );
    this.shelfCards$ = this.whiteboard$.pipe(
      map(whiteboard => whiteboard.shelfCards || []),
      map(shelfCards => {
        return shelfCards.map(c => ({
          ...c,
          mode: ModeEnum.SHELF,
          image: this.addApiBaseToImageUrl(c.image)
        }));
      })
    );
    this.defaultColor$ = this.whiteboard$.pipe(
      map(whiteboard => whiteboard.defaultColor)
    );
  }

  public saveWhiteboard(data: WhiteboardInterface): void {
    if (!this.canManage) return;

    // with canManage permission the workspace cards are duplicated in the shelf
    // without canManage permission, the workspace cards should not be persisted
    // so we must remove the workspace cards
    delete data.cards;

    data.shelfCards = data.shelfCards.map(card => {
      return {
        ...card,
        image: this.removeApiBaseFromImageUrl(card.image)
      };
    });
    this.whiteboardHttpService.setJson(data).subscribe();
  }

  private addApiBaseToImageUrl(image: ImageInterface): ImageInterface {
    const updatedImageUrl =
      image && image.imageUrl ? this.apiBase + image.imageUrl : null;

    return { ...image, imageUrl: updatedImageUrl };
  }

  private removeApiBaseFromImageUrl(image: ImageInterface): ImageInterface {
    const updatedImageUrl =
      image && image.imageUrl
        ? (image.imageUrl as String).split(this.apiBase, 1)[1]
        : null;

    return { ...image, imageUrl: updatedImageUrl };
  }
}
