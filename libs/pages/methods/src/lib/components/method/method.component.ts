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
import { take, withLatestFrom } from 'rxjs/operators';
import { CurrentMethodParams, MethodViewModel } from '../method.viewmodel';

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

  private currentMethodParams$: Observable<CurrentMethodParams>;

  constructor(private viewModel: MethodViewModel, private router: Router) {}

  ngOnInit() {
    this.boeke$ = this.viewModel.currentBoeke$;
    this.book$ = this.viewModel.currentBook$;
    this.chapters$ = this.viewModel.currentToc$;
    this.generalFilesByType$ = this.viewModel.generalFilesByType$;
    this.method$ = this.viewModel.currentMethod$;
    this.productTypes$ = this.viewModel.eduContentProductTypes$;
    this.currentTab$ = this.viewModel.currentTab$;
    this.currentMethodParams$ = this.viewModel.currentMethodParams$;
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  public clickOpenChapter(chapterId: number) {
    this.currentTab$
      .pipe(
        take(1),
        withLatestFrom(this.currentMethodParams$)
      )
      .subscribe(([tab, currentMethodParams]) => {
        this.router.navigate(['methods', currentMethodParams.book, chapterId], {
          queryParams: {
            tab
          }
        });
      });
  }

  public clickOpenBoeke(eduContent: EduContent): void {
    this.viewModel.openBoeke(eduContent);
  }

  public clickOpenGeneralFile(eduContent: EduContent): void {
    this.viewModel.openEduContentAsDownload(eduContent);
  }
}
