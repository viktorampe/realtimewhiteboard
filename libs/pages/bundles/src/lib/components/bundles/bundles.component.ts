import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';
import {
  BundleInfoInterface,
  BundlesWithContentInfoInterface
} from '../bundles.viewmodel.interfaces';

/**
 * component listing bundles en book-e's for learning area
 *
 * @export
 * @class BundlesComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  protected listFormat = ListFormat;

  listFormat$: Observable<ListFormat>;

  learningArea$: Observable<LearningAreaInterface>;
  sharedInfo$: Observable<BundlesWithContentInfoInterface>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    BundlesWithContentInfoInterface,
    BundleInfoInterface
  >;

  private routeParams$ = this.route.params.pipe(shareReplay(1));

  constructor(
    private route: ActivatedRoute,
    private bundlesViewModel: BundlesViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit(): void {
    this.learningArea$ = this.getLearningArea();
    this.sharedInfo$ = this.getSharedInfo();

    this.filterTextInput.filterFn = this.filterFn.bind(this);
    this.listFormat$ = this.bundlesViewModel.listFormat$;
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(value);
  }

  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routeParams$.pipe(
      switchMap(params => {
        return this.bundlesViewModel.getLearningAreaById(params.area);
      })
    );
  }

  private getSharedInfo(): Observable<BundlesWithContentInfoInterface> {
    return this.routeParams$.pipe(
      map(params => params.area),
      switchMap(areaId => {
        return this.bundlesViewModel.getSharedBundlesWithContentInfo(areaId);
      })
    );
  }

  private filterFn(
    info: BundlesWithContentInfoInterface,
    searchText: string
  ): BundleInfoInterface[] {
    return this.filterService.filter(info.bundles, {
      bundle: { name: searchText }
    });
  }
}
