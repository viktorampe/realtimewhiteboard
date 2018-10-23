import { Component, OnInit } from '@angular/core';
import { HeaderViewModel } from './header.viewmodel';

@Component({
  selector: 'campus-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(public vm: HeaderViewModel) {}

  ngOnInit() {}
}
