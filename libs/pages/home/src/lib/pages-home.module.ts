import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { HomeComponent } from './components/home/home.component';
import { MethodFavoriteTileComponent } from './components/method-favorite-tile/method-favorite-tile.component';
import { PagesHomeRoutingModule } from './pages-home-routing.module';

@NgModule({
  imports: [CommonModule, PagesHomeRoutingModule, UiModule, PagesSharedModule],
  declarations: [HomeComponent, MethodFavoriteTileComponent],
  exports: [MethodFavoriteTileComponent]
})
export class PagesHomeModule {}
