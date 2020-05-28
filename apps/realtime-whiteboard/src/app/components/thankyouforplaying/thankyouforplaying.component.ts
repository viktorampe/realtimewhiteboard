import { Component, OnInit } from '@angular/core';
import { FullscreenService } from '../../services/fullscreen/fullscreen.service';

@Component({
  selector: 'campus-thankyouforplaying',
  templateUrl: './thankyouforplaying.component.html',
  styleUrls: ['./thankyouforplaying.component.scss']
})
export class ThankyouforplayingComponent implements OnInit {
  constructor(private fullscreenService: FullscreenService) {}

  ngOnInit() {
    this.fullscreenService.setFullscreen(true);
  }
}
