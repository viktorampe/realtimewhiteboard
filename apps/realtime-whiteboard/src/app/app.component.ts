import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { iconMap } from 'libs/whiteboard/src/lib/icons/icon-mapping';
import { WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN } from 'libs/whiteboard/src/lib/tokens/whiteboard-element-icon-mapping.token';
import RealtimeSession from './models/realtimesession';
import { FullscreenService } from './services/fullscreen/fullscreen.service';
import { RealtimeSessionService } from './services/realtimesession/realtime-session.service';

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
  fullScreen: boolean;
  subscribedOnCards = false;

  constructor(
    @Inject(WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN) private iconMapping,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private sessionService: RealtimeSessionService,
    private fullscreenService: FullscreenService,
    private cdRef: ChangeDetectorRef
  ) {
    // whiteboard icons
    this.setupIconRegistry();
    // custom icons
    this.customIcons();
    // subscribe on session updates/deletes
    this.sessionService.subscribeOnSessionUpdates();
    this.sessionService.subscribeOnSessionDeletes();
    // subscribe on player creation/delets
    this.sessionService.subsribeOnDeletePlayer();
    this.sessionService.subscribeOnCreatePlayer();
    // subscribe on whiteboard updates
    this.sessionService.subscribeOnWhiteboardUpdates();
    // subscribe on card creation/deletes/updates
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimeSession: RealtimeSession) => {
        if (realtimeSession === null) return;
        if (this.subscribedOnCards) return;
        if (realtimeSession.whiteboard.id) {
          this.sessionService.subscribeOnDeleteCard(
            realtimeSession.whiteboard.id
          );
          this.sessionService.subscribeOnUpdateCard(
            realtimeSession.whiteboard.id
          );
          this.sessionService.subscribeOnCreateCard(
            realtimeSession.whiteboard.id
          );
          this.subscribedOnCards = true;
        }
      }
    );
  }

  ngOnInit() {
    // subscribe on fullscreen
    this.fullscreenService.isFullscreen$.subscribe((isFS: boolean) => {
      this.fullScreen = isFS;
      this.cdRef.detectChanges(); // removes error
    });
  }

  private customIcons() {
    this.iconRegistry.addSvgIcon(
      'cards',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/cards.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/close.svg')
    );
    this.iconRegistry.addSvgIcon(
      'minimize',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/minimize.svg')
    );
    this.iconRegistry.addSvgIcon(
      'play',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/play.svg')
    );
    this.iconRegistry.addSvgIcon(
      'players',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/players.svg')
    );
    this.iconRegistry.addSvgIcon(
      'settings',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/settings.svg')
    );
    this.iconRegistry.addSvgIcon(
      'share',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/share.svg')
    );
    this.iconRegistry.addSvgIcon(
      'stop',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/stop.svg')
    );
    this.iconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/menu.svg')
    );
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
