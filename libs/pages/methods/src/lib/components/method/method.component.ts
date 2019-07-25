import { Component, OnInit } from '@angular/core';
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
})
export class MethodComponent implements OnInit {
  public boeke$: Observable<EduContent>;
  public book$: Observable<EduContentBookInterface>;
  public currentMethod$: Observable<MethodInterface>;
  public toc$: Observable<EduContentTOCInterface[]>;
  public productTypes$: Observable<EduContentProductTypeInterface[]>;
  public generalFilesByType$: Observable<Dictionary<EduContent[]>>;

  constructor(private viewModel: MethodViewModel) {}

  ngOnInit() {
    this.toc$ = this.viewModel.currentToc$;
    this.boeke$ = this.viewModel.currentBoeke$;
    this.book$ = this.viewModel.currentBook$;
    this.productTypes$ = this.viewModel.eduContentProductTypes$;
    this.generalFilesByType$ = this.viewModel.generalFilesByType$;
  }

  public clickOpenBoeke(eduContent: EduContent): void {
    this.viewModel.openBoeke(eduContent);
  }

  public clickOpenGeneralFile(eduContent: EduContent): void {
    this.viewModel.openEduContentAsDownload(eduContent);
  }
}
