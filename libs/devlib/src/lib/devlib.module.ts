import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { PagesHomeModule } from '@campus/pages/home';
import { SearchModule } from '@campus/search';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { DemoPageComponent } from './demo-page/demo-page.component';
import { DevlibRoutingModule } from './devlib.routing.module';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';
import { WhiteboardDemoPageComponent } from './whiteboard-demo-page/whiteboard-demo-page.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    DevlibRoutingModule,
    SharedModule,
    MatIconModule,
    SearchModule,
    PagesHomeModule
  ],
  providers: [LoginPageViewModel],
  declarations: [LoginpageComponent, DemoPageComponent, WhiteboardDemoPageComponent],
  exports: [],
  entryComponents: []
})
export class DevlibModule {}
