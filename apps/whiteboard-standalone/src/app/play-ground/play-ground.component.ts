import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'campus-play-ground',
  templateUrl: './play-ground.component.html',
  styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnInit {
  metadataId = 22;
  apiBase = environment.api.APIBase;

  constructor() {}

  ngOnInit() {}
}
