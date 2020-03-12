import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'campus-play-ground',
  templateUrl: './play-ground.component.html',
  styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnInit {
  metadataIds = [22, 123, 124, 125];
  metadataId = undefined;
  apiBase = environment.api.APIBase + '/api';

  constructor() {}

  ngOnInit() {}

  onPickWhiteboard(id: number) {
    this.metadataId = id;
  }
}
