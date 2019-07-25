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
  public chapters$: Observable<EduContentTOCInterface[]>;
  public generalFilesByType$: Observable<Dictionary<EduContent[]>>;
  public method$: Observable<MethodInterface>;
  public productTypes$: Observable<EduContentProductTypeInterface[]>;

  constructor(private viewModel: MethodViewModel) {}

  ngOnInit() {
    this.boeke$ = this.viewModel.currentBoeke$;
    this.book$ = this.viewModel.currentBook$;
    this.chapters$ = this.viewModel.currentToc$;
    this.generalFilesByType$ = this.viewModel.generalFilesByType$;
    this.method$ = this.viewModel.currentMethod$;
    this.productTypes$ = this.viewModel.eduContentProductTypes$;
  }

  public clickOpenBoeke(eduContent: EduContent): void {
    this.viewModel.openBoeke(eduContent);
  }

  public clickOpenGeneralFile(eduContent: EduContent): void {
    this.viewModel.openEduContentAsDownload(eduContent);
  }
}
