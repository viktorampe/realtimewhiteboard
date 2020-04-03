import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-whiteboard-demo-page',
  templateUrl: './whiteboard-demo-page.component.html',
  styleUrls: ['./whiteboard-demo-page.component.scss']
})
export class WhiteboardDemoPageComponent implements OnInit {
  canManage = true;
  data = {
    title: 'Welcome to the 90s',
    cards: [
      {
        id: 1,
        description: 'Windows 95',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      },
      {
        id: 2,
        description: 'Get Ready',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 3,
        description: 'Candy',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 4,
        description: 'VRC',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 5,
        description: 'Gameboy',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 6,
        description: 'Home Alone',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      },
      {
        id: 7,
        description: 'NSYNC',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      },
      {
        id: 8,
        description: 'Capri Sun',
        image: {
          imageUrl: 'http://api.kabas.localhost:3000/api/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      }
    ]
  };

  constructor() {}

  ngOnInit() {}
}
