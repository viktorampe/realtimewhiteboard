import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  EduContent,
  EduContentBookInterface,
  EduContentProductTypeInterface,
  EduContentTOCInterface,
  MethodInterface
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { MethodViewModel } from '../method.viewmodel';

@Component({
  selector: 'campus-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
  // providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
})
export class MethodComponent implements OnInit {
  public boeke$: Observable<EduContent>;
  public book$: Observable<EduContentBookInterface>;
  public chapters$: Observable<EduContentTOCInterface[]>;
  public generalFilesByType$: Observable<Dictionary<EduContent[]>>;
  public method$: Observable<MethodInterface>;
  public productTypes$: Observable<EduContentProductTypeInterface[]>;
  public currentTab$: Observable<number>;

  constructor(private viewModel: MethodViewModel, private router: Router) {}

  ngOnInit() {
    this.boeke$ = this.viewModel.currentBoeke$;
    this.book$ = this.viewModel.currentBook$;
    this.chapters$ = this.viewModel.currentToc$;
    this.generalFilesByType$ = this.viewModel.generalFilesByType$;
    this.method$ = this.viewModel.currentMethod$;
    this.productTypes$ = this.viewModel.eduContentProductTypes$;
    this.currentTab$ = this.viewModel.currentTab$;
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  public clickOpenBoeke(eduContent: EduContent): void {
    this.viewModel.openBoeke(eduContent);
  }

  public clickOpenGeneralFile(eduContent: EduContent): void {
    this.viewModel.openEduContentAsDownload(eduContent);
  }
}
