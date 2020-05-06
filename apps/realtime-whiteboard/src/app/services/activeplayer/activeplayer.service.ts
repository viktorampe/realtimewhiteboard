import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Player from '../../models/player';

@Injectable({
  providedIn: 'root'
})
export class ActiveplayerService {
  activePlayer$ = new BehaviorSubject<Player>(null);

  constructor() {}

  setActivePlayer(player: Player) {
    this.activePlayer$.next(player);
  }
}
