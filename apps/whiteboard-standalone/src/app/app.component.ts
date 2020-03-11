import { Component } from '@angular/core';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'whiteboard-standalone';

  metadataId = 22;
  apiBase = 'https://api.staging.lk2020.be/api';
}
