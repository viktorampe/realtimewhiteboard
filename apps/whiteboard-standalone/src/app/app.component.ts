import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../environments/environment';
import { WhiteboardConfigService } from './config.service';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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

  form: FormGroup;

  eduContentMetadataIds = [22, 123, 124, 125];

  constructor(
    private fb: FormBuilder,
    private configService: WhiteboardConfigService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      canManage: [true],
      apiBase: [environment.api.APIBase],
      eduContentMetadataId: [this.eduContentMetadataIds[0]]
    });
  }

  onSubmit() {
    this.configService.setConfig(this.form.value);
  }
}
