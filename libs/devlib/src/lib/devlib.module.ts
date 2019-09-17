import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { SearchModule } from '@campus/search';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { MethodFavoriteTileComponent } from 'libs/pages/home/src/lib/components/method-favorite-tile/method-favorite-tile.component';
import { DemoPageComponent } from './demo-page/demo-page.component';
import { DevlibRoutingModule } from './devlib.routing.module';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    DevlibRoutingModule,
    SharedModule,
    MatIconModule,
    SearchModule
  ],
  providers: [LoginPageViewModel],
  declarations: [
    LoginpageComponent,
    DemoPageComponent,
    MethodFavoriteTileComponent
  ],
  exports: [],
  entryComponents: []
})
export class DevlibModule {}
