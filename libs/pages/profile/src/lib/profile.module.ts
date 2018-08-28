import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './components/profile.component';
import { ProfileViewModel } from './components/profile.viewmodel';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule],
  exports: [],
  providers: [ProfileViewModel]
})
export class ProfileModule {}
