import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { HomeComponent } from './components/home/home.component';
import { PagesHomeRoutingModule } from './pages-home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesHomeRoutingModule,
    UiModule,
    PagesSharedModule,
    SharedModule
  ],
  declarations: [HomeComponent]
})
export class PagesHomeModule {}
