import { Component, OnInit } from '@angular/core';
import { CardTypeEnum } from 'libs/whiteboard/src/lib/enums/cardType.enum';
import { ModeEnum } from 'libs/whiteboard/src/lib/enums/mode.enum';
import { WhiteboardInterface } from 'libs/whiteboard/src/lib/models/whiteboard.interface';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'campus-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {
  canManage: boolean;
  whiteboard: WhiteboardInterface = {
    title: 'realtime whiteboard',
    defaultColor: '#5D3284',
    cards: [
      {
        id: uuidv4(),
        mode: ModeEnum.IDLE,
        type: CardTypeEnum.TEACHERCARD,
        color: '#5D3284',
        description: 'realtime card',
        image: null,
        top: 0,
        left: 0,
        viewModeImage: false
      },
      {
        id: uuidv4(),
        mode: ModeEnum.IDLE,
        type: CardTypeEnum.TEACHERCARD,
        color: '#5D3284',
        description: 'realtime card 2',
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
        color: '#5D3284',
        description: 'realtime shelfcard',
        image: null,
        top: 0,
        left: 0,
        viewModeImage: false
      }
    ]
  };

  constructor() {}

  ngOnInit() {
    this.canManage = false;
  }
}
