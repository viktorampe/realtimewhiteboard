import { Inject, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '@campus/shared';
import { WhiteboardModule } from '@campus/whiteboard';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PlayGroundComponent } from './play-ground/play-ground.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, PlayGroundComponent],
  imports: [
    BrowserModule,
    DalModule.forRoot({ apiBaseUrl: environment.api.APIBase }),
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'login' },
        { path: 'login', component: LoginComponent },
        { path: 'whiteboard', component: PlayGroundComponent }
      ],
      {
        initialNavigation: 'enabled'
      }
    ),
    WhiteboardModule
  ],
  providers: [
    {
      provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
      useValue: environment.iconMapping
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(ENVIRONMENT_ICON_MAPPING_TOKEN)
    private iconMapping: { [icon: string]: string }
  ) {
    for (const key in this.iconMapping) {
      if (key.indexOf(':') > 0) {
        this.iconRegistry.addSvgIconInNamespace(
          key.split(':')[0],
          key.split(':')[1],
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      } else {
        this.iconRegistry.addSvgIcon(
          key,
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      }
    }
  }
}
