import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import Player from '../../models/player';

@Injectable({
  providedIn: 'root'
})
export class ActiveplayerService {
  key = 'Player';
  activePlayer$ = new BehaviorSubject<Player>(this.getActivePlayer());

  constructor(private cookieService: CookieService) {}

  setActivePlayer(player: Player) {
    this.cookieService.set(this.key, JSON.stringify(player));
    this.activePlayer$.next(player);
  }

  deleteActivePlayer(playerId: string) {
    const activePlayer = this.getActivePlayer();
    if (activePlayer.id === playerId) {
      this.cookieService.delete(this.key);
    }
    this.activePlayer$.next(null);
  }

  private getActivePlayer(): Player {
    const player = this.cookieService.get(this.key);
    if (player) {
      return JSON.parse(player);
    } else {
      return null;
    }
  }
}
