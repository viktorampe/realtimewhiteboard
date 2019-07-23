import { Component, Inject, OnInit } from '@angular/core';
import {
  ContentActionsServiceInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN
} from '@campus/shared';

@Component({
  selector: 'campus-methods-overview',
  templateUrl: './methods-overview.component.html',
  styleUrls: ['./methods-overview.component.scss']
})
export class MethodsOverviewComponent implements OnInit {
  constructor(
    @Inject(CONTENT_ACTIONS_SERVICE_TOKEN)
    contentActionsService: ContentActionsServiceInterface
  ) {
    console.log(contentActionsService);
  }

  ngOnInit() {}
}
