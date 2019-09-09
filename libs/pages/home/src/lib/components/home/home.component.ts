import { Component } from '@angular/core';
import { HomeViewModel } from '../home.viewmodel';

@Component({
  selector: 'campus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private homeViewModel: HomeViewModel) {}
}
