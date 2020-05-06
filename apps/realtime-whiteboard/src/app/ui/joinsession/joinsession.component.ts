import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Player from '../../models/player';

@Component({
  selector: 'campus-joinsession',
  templateUrl: './joinsession.component.html',
  styleUrls: ['./joinsession.component.scss']
})
export class JoinsessionComponent implements OnInit {
  @Output() joinSession = new EventEmitter<{
    player: Player;
    pincode: number;
  }>();

  pincodeFormControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(999999)
  ]);

  constructor() {}

  ngOnInit() {}

  join() {
    const player: Player = {
      id: null,
      sessionId: null,
      fullName: 'viktor ampe'
    };
    if (this.pincodeFormControl.valid) {
      this.joinSession.emit({
        player: player,
        pincode: this.pincodeFormControl.value
      });
    }
  }
}
