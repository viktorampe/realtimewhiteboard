import { Inject, Injectable, Type } from '@angular/core';
import {
  DalState,
  EduNetInterface,
  EduNetQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  LearningPlanServiceInterface,
  LEARNING_PLAN_SERVICE_TOKEN,
  SchoolTypeInterface,
  SchoolTypeQueries,
  SpecialtyInterface,
  YearInterface
} from '@campus/dal';
import {
  BreadcrumbFilterComponent,
  ColumnFilterComponent,
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  EDU_NETS_FILTER_PROPS,
  LEARNING_AREA_FILTER_PROPS,
  SCHOOL_TYPES_FILTER_PROPS,
  SPECIALITIES_FILTER_PROPS,
  YEARS_FILTER_PROPS
} from './learning-plan-filter-props';

enum ColumnLevel {
  LEARNING_AREA,
  EDU_NET,
  SCHOOL_TYPE,
  YEAR,
  SPECIALITY
}

@Injectable({ providedIn: 'root' })
export class LearningPlanFilterFactory implements SearchFilterFactory {
  private outputFilters: {
    component: Type<SearchFilterComponentInterface>;
    domHost: string;
  }[] = [
    { component: ColumnFilterComponent, domHost: 'hostLeft' },
    { component: BreadcrumbFilterComponent, domHost: 'hostBreadCrumbs' }
  ];

  private learningAreas$: Observable<LearningAreaInterface[]>;
  private eduNets$: Observable<EduNetInterface[]>;
  private schoolTypes$: Observable<SchoolTypeInterface[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(LEARNING_PLAN_SERVICE_TOKEN)
    private learningPlanService: LearningPlanServiceInterface
  ) {
    this.loadStreams();
  }

  private loadStreams(): any {
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));
    this.eduNets$ = this.store.pipe(select(EduNetQueries.getAll));
    this.schoolTypes$ = this.store.pipe(select(SchoolTypeQueries.getAll));
  }

  public getPredictionFilterNames(searchState: SearchStateInterface): string[] {
    const startingColumnIds = this.getStartingColumnSelectedIds(searchState);
    const columnLevel = this.getColumnLevel(startingColumnIds);

    const filterNames: string[] = [];
    for (let index = 1; index <= columnLevel; index++) {
      filterNames.push(this.getSearchFilterStringProperties(index).name);
    }

    return filterNames;
  }

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const startingColumnIds = this.getStartingColumnSelectedIds(searchState);
    const columnLevel = this.getColumnLevel(startingColumnIds);
    return this.getSearchFilterCriteria(startingColumnIds, columnLevel).pipe(
      map(criteria =>
        this.outputFilters.map(
          outputFilter =>
            ({
              criteria,
              component: outputFilter.component,
              domHost: outputFilter.domHost
            } as SearchFilterInterface)
        )
      )
    );
  }

  private getSearchFilterCriteria(
    selectedPropertyIds: SelectedPropertyIds,
    columnLevel: number
  ): Observable<SearchFilterCriteriaInterface[]> {
    const years$: Observable<YearInterface[]> =
      columnLevel >= ColumnLevel.YEAR
        ? this.learningPlanService.getAvailableYearsForSearch(
            selectedPropertyIds[ColumnLevel.LEARNING_AREA],
            selectedPropertyIds[ColumnLevel.EDU_NET],
            selectedPropertyIds[ColumnLevel.SCHOOL_TYPE]
          )
        : of(undefined);
    const specialities$: Observable<SpecialtyInterface[]> =
      columnLevel >= ColumnLevel.SPECIALITY
        ? this.learningPlanService.getSpecialities(
            selectedPropertyIds[ColumnLevel.EDU_NET],
            selectedPropertyIds[ColumnLevel.YEAR],
            selectedPropertyIds[ColumnLevel.SCHOOL_TYPE],
            selectedPropertyIds[ColumnLevel.LEARNING_AREA]
          )
        : of(undefined);
    return combineLatest([
      this.learningAreas$,
      this.eduNets$,
      this.schoolTypes$,
      years$,
      specialities$
    ]).pipe(
      map(
        (
          columnValuesData: [
            LearningAreaInterface[],
            EduNetInterface[],
            SchoolTypeInterface[],
            YearInterface[],
            SpecialtyInterface[]
          ]
        ) => {
          const searchFilterCriteria: SearchFilterCriteriaInterface[] = [];
          for (let i = 1; i <= columnLevel; i++) {
            searchFilterCriteria.push(
              this.getSearchFilterCriteriaForColumns(i, columnValuesData[i])
            );
          }
          return searchFilterCriteria;
        }
      )
    );
  }

  private getSearchFilterCriteriaForColumns(
    currentColumnLevel: number,
    startingColumnValues
  ): SearchFilterCriteriaInterface {
    return {
      ...this.getSearchFilterStringProperties(currentColumnLevel),
      values: startingColumnValues.map(value => ({
        data: value,
        hasChild:
          currentColumnLevel !==
          Object.keys(ColumnLevel).filter(key => isNaN(Number(key))).length - 1
      }))
    };
  }

  private getStartingColumnSelectedIds(
    searchState: SearchStateInterface
  ): SelectedPropertyIds {
    const learningAreas = searchState.filterCriteriaSelections.get(
      LEARNING_AREA_FILTER_PROPS.name
    );
    const eduNets = searchState.filterCriteriaSelections.get(
      EDU_NETS_FILTER_PROPS.name
    );
    const schoolTypes = searchState.filterCriteriaSelections.get(
      SCHOOL_TYPES_FILTER_PROPS.name
    );
    const years = searchState.filterCriteriaSelections.get(
      YEARS_FILTER_PROPS.name
    );
    return [
      this.getFirstValueAsNumber(learningAreas),
      this.getFirstValueAsNumber(eduNets),
      this.getFirstValueAsNumber(schoolTypes),
      this.getFirstValueAsNumber(years)
    ];
  }

  private getFirstValueAsNumber(arr: (string | number)[]): number {
    if (!arr) return undefined;
    return typeof arr[0] === 'string'
      ? parseInt(arr[0] as string, 10)
      : (arr[0] as number);
  }

  private getColumnLevel([
    learningAreaId,
    eduNetId,
    schoolTypeId,
    yearId
  ]: SelectedPropertyIds): ColumnLevel {
    if (learningAreaId && eduNetId && schoolTypeId && yearId)
      return ColumnLevel.SPECIALITY;
    if (learningAreaId && eduNetId && schoolTypeId) return ColumnLevel.YEAR;
    if (learningAreaId && eduNetId) return ColumnLevel.SCHOOL_TYPE;
    if (learningAreaId) return ColumnLevel.EDU_NET;
    return ColumnLevel.LEARNING_AREA;
  }

  private getSearchFilterStringProperties(
    currentColumnLevel: ColumnLevel
  ): StartingLevelStringPropertiesInterface {
    switch (currentColumnLevel) {
      case ColumnLevel.LEARNING_AREA:
        return LEARNING_AREA_FILTER_PROPS;
      case ColumnLevel.EDU_NET:
        return EDU_NETS_FILTER_PROPS;
      case ColumnLevel.SCHOOL_TYPE:
        return SCHOOL_TYPES_FILTER_PROPS;
      case ColumnLevel.YEAR:
        return YEARS_FILTER_PROPS;
      case ColumnLevel.SPECIALITY:
        return SPECIALITIES_FILTER_PROPS;
      default:
        throw Error(
          `LearningPlanFilterFactory: getStartingFilterStringProperties: Given currentColumnLevel: ${currentColumnLevel} should not exist`
        );
    }
  }
}

interface StartingLevelStringPropertiesInterface {
  name: string;
  label: string;
  keyProperty: string;
  displayProperty: string;
}

type SelectedPropertyIds = [number, number, number, number];
