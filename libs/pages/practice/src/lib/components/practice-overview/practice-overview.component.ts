import { Component, OnInit } from '@angular/core';
import { MethodYearsInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';

@Component({
  selector: 'campus-practice-overview',
  templateUrl: './practice-overview.component.html',
  styleUrls: ['./practice-overview.component.scss']
})
export class PracticeOverviewComponent implements OnInit {
  public allowedBooks$: Observable<MethodYearsInterface[]>;
  constructor(private practiceViewmodel: PracticeViewModel) {}

  private setupStreams() {
    this.allowedBooks$ = this.practiceViewmodel.methodYears$;
  }
  ngOnInit() {
    this.setupStreams();
  }
}
