import { Injectable } from '@angular/core';
import { AuthService } from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export interface WhiteboardConfigInterface {
  apiBase: string;
  canManage: boolean;
  eduContentMetadataId: number;
  useLocal: boolean;
  whiteboardData: object;
}
@Injectable({ providedIn: 'root' })
export class WhiteboardConfigService {
  private _teacher = {
    username: 'teacher1',
    password: 'testje'
  };

  // this is the data that's seeded
  private _eduContentMetadataEduContentMap = {
    22: 24,
    123: 125,
    124: 126,
    125: 127,
    251: 128
  };

  private _whiteboardData = {
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

  private _config$ = new BehaviorSubject<WhiteboardConfigInterface>(null);

  public config$ = this._config$ as Observable<WhiteboardConfigInterface>;

  constructor(private authService: AuthService) {}

  setConfig(config: WhiteboardConfigInterface): void {
    if (config.useLocal) config.whiteboardData = this._whiteboardData;
    this._config$.next(config);
  }

  previewInWrapper(apiBase: string, eduContentMetadataId: number) {
    // for viewing the wrapper, you have to be logged in
    this.authService
      .login({
        username: this._teacher.username,
        password: this._teacher.password
      })
      .pipe(take(1))
      .subscribe(response => {
        // get url
        const url = `${apiBase}/eduContents/${this._eduContentMetadataEduContentMap[eduContentMetadataId]}/redirectURL/${eduContentMetadataId}`;

        window.open(url);
      });
  }
}
