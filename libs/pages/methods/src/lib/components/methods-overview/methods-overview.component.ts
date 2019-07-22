import { Component, OnInit } from '@angular/core';
import { MethodViewModel } from '../method.viewmodel';
import { MockMethodViewModel } from '../method.viewmodel.mock';

@Component({
  selector: 'campus-methods-overview',
  templateUrl: './methods-overview.component.html',
  styleUrls: ['./methods-overview.component.scss'],
  providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
})
export class MethodsOverviewComponent implements OnInit {
  public allowedMethods$ = this.methodViewmodel.allowedBooks$;
  constructor(private methodViewmodel: MethodViewModel) {}

  ngOnInit() {}
}
