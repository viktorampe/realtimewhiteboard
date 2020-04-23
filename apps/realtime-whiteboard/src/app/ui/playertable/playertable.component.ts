import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import Player from '../../models/player';

@Component({
  selector: 'campus-playertable',
  templateUrl: './playertable.component.html',
  styleUrls: ['./playertable.component.scss']
})
export class PlayertableComponent implements OnInit {
  @Input() players: Player[];
  displayedColumns: string[] = ['name'];
  dataSource: any;

  constructor() {
    this.dataSource = new MatTableDataSource<Player>();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.players);
  }
}
