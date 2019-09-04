import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { HomeComponent } from './components/home.component';
import { HomeViewModel } from './components/home.viewmodel';
import { PagesHomeRoutingModule } from './pages-home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesHomeRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [
    HomeComponent,
  ],
  providers: [HomeViewModel]
})
export class PagesHomeModule {}
