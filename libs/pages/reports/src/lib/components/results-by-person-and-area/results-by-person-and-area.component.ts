import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningAreaInterface, ResultInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ReportsViewModel } from '../reports.viewmodel';
import { AssignmentResultInterface } from '../reports.viewmodel.interfaces';

@Component({
  selector: 'campus-results-by-person-and-area',
  templateUrl: './results-by-person-and-area.component.html',
  styleUrls: ['./results-by-person-and-area.component.scss']
})
export class ResultsByPersonAndAreaComponent implements OnInit {
  @ViewChild('header', { static: false }) private header: ElementRef;

  //input streams
  private routerParams$: Observable<Params>;

  //output streams
  learningArea$: Observable<LearningAreaInterface>;
  ownResults$: Observable<AssignmentResultInterface[]>;

  constructor(
    private reportsViewModel: ReportsViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadInputParams();
    this.loadOutputStreams();
  }

  //initializer methods
  private loadInputParams(): void {
    this.routerParams$ = this.activatedRoute.params;
  }

  private loadOutputStreams(): void {
    this.learningArea$ = this.getLearningArea();
    this.ownResults$ = this.getOwnResults();
  }

  //stream getters
  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routerParams$.pipe(
      switchMap(params => {
        return this.reportsViewModel.getLearningAreaById(+params.area);
      })
    );
  }

  private getOwnResults(): Observable<AssignmentResultInterface[]> {
    return this.routerParams$.pipe(
      switchMap(params => {
        return this.reportsViewModel.getAssignmentResultsByLearningArea(
          +params.area
        );
      })
    );
  }

  //event handlers
  clickOpenContentForReview(result: ResultInterface): void {
    this.reportsViewModel.openContentForReview(result);
  }

  public onScroll(event) {
    if (!this.header) return;

    const scrollOptions = {
      left: event.currentTarget.scrollLeft
    } as ScrollToOptions;

    this.header.nativeElement.scrollTo(scrollOptions);
  }
}
