import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';
import { UnlockedBookInterface } from '../practice.viewmodel.selectors';

@Component({
  selector: 'campus-practice-overview',
  templateUrl: './practice-overview.component.html',
  styleUrls: ['./practice-overview.component.scss']
})
export class PracticeOverviewComponent {
  public unlockedBooks$: Observable<UnlockedBookInterface[]>;

  constructor(private practiceViewModel: PracticeViewModel) {
    this.unlockedBooks$ = practiceViewModel.unlockedBooks$;
  }
}
