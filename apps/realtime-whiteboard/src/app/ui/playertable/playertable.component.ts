import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import Player from '../../models/player';

@Component({
  selector: 'campus-playertable',
  templateUrl: './playertable.component.html',
  styleUrls: ['./playertable.component.scss']
})
export class PlayertableComponent implements OnInit {
  @Input() players: Player[];
  @Output() onRemovePlayer = new EventEmitter<Player>();
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  displayedColumns: string[] = ['name', 'action'];
  dataSource: any;

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<Player>();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.players);
  }

  removePlayer(player: Player) {
    this.onRemovePlayer.emit(player);
    this.players = this.players.filter(p => p.id !== player.id);
    this.dataSource = new MatTableDataSource(this.players);
  }
}
