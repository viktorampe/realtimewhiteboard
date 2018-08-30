import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
import { LoginpageComponent } from './loginpage/loginpage.component';
@NgModule({
  imports: [
    DalModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LoginpageComponent }
    ])
  ],
  declarations: [LoginpageComponent]
})
export class DevlibModule {}
