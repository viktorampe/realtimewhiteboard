import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import Player from '../../models/player';

@Injectable({
  providedIn: 'root'
})
export class ActiveplayerService {
  key = 'Player';

  constructor(private cookieService: CookieService) {}

  setActivePlayer(player: Player) {
    this.cookieService.set(this.key, JSON.stringify(player));
  }

  getActivePlayer(): Player {
    const player = this.cookieService.get(this.key);
    if (player) {
      return JSON.parse(player);
    } else {
      return null;
    }
  }
}
