import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MethodViewModel } from '../method.viewmodel';

@Component({
  selector: 'campus-methods-overview',
  templateUrl: './methods-overview.component.html',
  styleUrls: ['./methods-overview.component.scss']
  // providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
})
export class MethodsOverviewComponent implements OnInit {
  public allowedBooks$: Observable<any>; // TODO use interface
  constructor(private methodViewmodel: MethodViewModel) {}

  ngOnInit() {
    this.setupStreams();
  }

  private setupStreams() {
    this.allowedBooks$ = this.methodViewmodel.allowedBooks$;
  }
}
