import { Component, OnInit } from '@angular/core';
import { AuthService } from '@campus/dal';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WhiteboardConfigService } from '../config.service';

@Component({
  selector: 'campus-play-ground',
  templateUrl: './play-ground.component.html',
  styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnInit {
  loggedIn = false;

  canManage = false;
  eduContentMetadataId: number;
  apiBase = environment.api.APIBase + '/api';

  eduContentMetadataIds = [22, 123, 124, 125];

  constructor(
    private authService: AuthService,
    private configService: WhiteboardConfigService
  ) {}

  ngOnInit(): void {
    this.login();
  }

  login(username?: string, password?: string) {
    username = 'piet';
    password = 'testje';
    this.authService
      .login({ username, password })
      .pipe(take(1))
      .subscribe(response => {
        if (response.userId) this.loggedIn = true;
      });
  }

  logout() {
    this.authService.logout();
  }

  toggleCanManage() {
    this.canManage = !this.canManage;
  }

  changeEduContentMetadataId(id: number) {
    this.eduContentMetadataId = id;
  }

  openInWrapper() {
    this.configService.previewInWrapper(
      this.apiBase,
      this.eduContentMetadataId
    );
  }
}
