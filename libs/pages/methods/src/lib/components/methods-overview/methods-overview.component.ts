import { Component, Inject, OnInit } from '@angular/core';
import { MethodYearsInterface } from '@campus/dal';
import {
  ContentActionsServiceInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN
} from '@campus/shared';
import { Observable } from 'rxjs';
import { MethodViewModel } from '../method.viewmodel';

@Component({
  selector: 'campus-methods-overview',
  templateUrl: './methods-overview.component.html',
  styleUrls: ['./methods-overview.component.scss']
  // providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
})
export class MethodsOverviewComponent implements OnInit {
  public allowedBooks$: Observable<MethodYearsInterface[]>;

  constructor(
    private methodViewmodel: MethodViewModel,
    @Inject(CONTENT_ACTIONS_SERVICE_TOKEN)
    contentActionsService: ContentActionsServiceInterface
  ) {}

  ngOnInit() {
    this.setupStreams();
  }

  private setupStreams() {
    this.allowedBooks$ = this.methodViewmodel.methodYears$;
  }
}
