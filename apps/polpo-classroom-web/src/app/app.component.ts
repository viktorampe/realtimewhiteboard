import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'polpo-classroom-web';

  /**
   * the link to the promo website, used on the logo
   */
  protected websiteUrl: string = environment.website.url;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.setupIconRegistry();
  }

  // TODO move to bootstrap files later
  private setupIconRegistry() {
    for (const key in environment.iconMapping) {
      if (key.indexOf(':') > 0) {
        this.iconRegistry.addSvgIconInNamespace(
          key.split(':')[0],
          key.split(':')[1],
          this.sanitizer.bypassSecurityTrustResourceUrl(
            environment.iconMapping[key]
          )
        );
      } else {
        this.iconRegistry.addSvgIcon(
          key,
          this.sanitizer.bypassSecurityTrustResourceUrl(
            environment.iconMapping[key]
          )
        );
      }
    }
  }
}
