import { Component, Inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { iconMap } from 'libs/whiteboard/src/lib/icons/icon-mapping';
import { WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN } from 'libs/whiteboard/src/lib/tokens/whiteboard-element-icon-mapping.token';
import { RealtimeSessionService } from './services/realtime-session.service';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN, useValue: iconMap } // this component is used as angular-element, it can not resolve relative urls
  ]
})
export class AppComponent {
  title = 'realtime-whiteboard';

  constructor(
    @Inject(WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN) private iconMapping,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private sessionService: RealtimeSessionService
  ) {
    this.setupIconRegistry();
    // subscribe on session updates/deletes
    this.sessionService.subscribeOnSessionUpdates();
    this.sessionService.subscribeOnSessionDeletes();
    // subscribe on player creation
    this.sessionService.subscribeOnCreatePlayer();
  }

  private setupIconRegistry() {
    for (const key in this.iconMapping) {
      if (key.indexOf(':') > 0) {
        this.iconRegistry.addSvgIconLiteralInNamespace(
          key.split(':')[0],
          key.split(':')[1],
          this.sanitizer.bypassSecurityTrustHtml(this.iconMapping[key])
        );
      } else {
        this.iconRegistry.addSvgIconLiteral(
          key,
          this.sanitizer.bypassSecurityTrustHtml(this.iconMapping[key])
        );
      }
    }
  }
}
