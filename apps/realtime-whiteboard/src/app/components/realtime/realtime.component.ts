import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CardTypeEnum } from 'libs/whiteboard/src/lib/enums/cardType.enum';
import { ModeEnum } from 'libs/whiteboard/src/lib/enums/mode.enum';
import { iconMap } from 'libs/whiteboard/src/lib/icons/icon-mapping';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN } from 'libs/whiteboard/src/lib/tokens/whiteboard-element-icon-mapping.token';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'campus-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss'],
  providers: [
    { provide: WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN, useValue: iconMap } // this component is used as angular-element, it can not resolve relative urls
  ]
})
export class RealtimeComponent implements OnInit {
  canManage: boolean;
  whiteboard: WhiteboardInterface = {
    title: 'realtime whiteboard',
    defaultColor: '#FFFFFF',
    cards: [
      {
        id: uuidv4(),
        mode: ModeEnum.IDLE,
        type: CardTypeEnum.TEACHERCARD,
        color: '#F8F8F8',
        description: 'reatlime card',
        image: null,
        top: 0,
        left: 0,
        viewModeImage: false
      },
      {
        id: uuidv4(),
        mode: ModeEnum.IDLE,
        type: CardTypeEnum.TEACHERCARD,
        color: '#F8F8F8',
        description: 'reatlime card 2',
        image: null,
        top: 0,
        left: 0,
        viewModeImage: false
      }
    ],
    shelfCards: [
      {
        id: uuidv4(),
        mode: ModeEnum.SHELF,
        type: CardTypeEnum.PUBLISHERCARD,
        color: '#F8F8F8',
        description: 'reatlime shelfcard',
        image: null,
        top: 0,
        left: 0,
        viewModeImage: false
      }
    ]
  };

  constructor(
    @Inject(WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN) private iconMapping,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.setupIconRegistry();
  }

  ngOnInit() {
    this.canManage = false;
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
