import { Component } from '@angular/core';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'whiteboard-standalone';
  canManage = false;
  apiBase = 'http://api.kabas.localhost:3000/api';
  whiteboard = {
    title: 'Welcome to the 90s',
    shelfCards: [
      {
        id: 1,
        description: 'Windows 95',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      },
      {
        id: 2,
        description: 'Get Ready',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 3,
        description: 'Candy',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 4,
        description: 'VRC',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 5,
        description: 'Gameboy',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#00A7E2'
      },
      {
        id: 6,
        description: 'Home Alone',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      },
      {
        id: 7,
        description: 'NSYNC',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      },
      {
        id: 8,
        description: 'Capri Sun',
        image: {
          imageUrl: '/EduFiles/8/redirectUrl'
        },
        color: '#2EA03D'
      }
    ],
    cards: [],
    defaultColor: ''
  };
}
