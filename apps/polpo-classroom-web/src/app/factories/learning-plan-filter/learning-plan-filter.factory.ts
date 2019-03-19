import { Inject, Injectable } from '@angular/core';
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
  YearInterface
} from '@campus/dal';
import {
  ColumnFilterComponent,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LearningPlanFilterFactory implements SearchFilterFactory {
  learningAreas$: Observable<LearningAreaInterface[]>;
  eduNets$: Observable<EduNetInterface[]>;
  schoolTypes$: Observable<SchoolTypeInterface[]>;
  years$: Observable<YearInterface[]>;

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

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const startingColumnIds = this.getStartingColumnIds(searchState);
    const columnLevel = this.getColumnLevel(startingColumnIds);
    const startingFilters = this.getStartingFilters(
      startingColumnIds,
      columnLevel
    );
    return columnLevel >= 3
      ? startingFilters
      : this.getDeepFilters(startingColumnIds, searchState);
  }

  private getStartingFilters(
    startingColumnIds: [number, number, number],
    columnLevel: number
  ): Observable<SearchFilterInterface[]> {
    combineLatest(this.learningAreas$, this.eduNets$, this.schoolTypes$).pipe(
      map(
        (
          startingColumnValues: [
            LearningAreaInterface[],
            EduNetInterface[],
            SchoolTypeInterface[]
          ]
        ) => {
          const startingSearchFilters: SearchFilterInterface[] = [];
          for (let i = 0; i < columnLevel; i++) {
            startingSearchFilters.push(
              this.getStartingFilter(
                i,
                startingColumnIds[i],
                startingColumnValues[i]
              )
            );
          }
        }
      )
    );
    return null;
  }

  private getStartingFilter(
    currentColumnLevel: number,
    propertyId: number,
    startingColumnValues
  ): SearchFilterInterface {
    return {
      criteria: this.getStartingLevelSearchFilterCriteria(
        currentColumnLevel,
        propertyId,
        startingColumnValues
      ),
      component: ColumnFilterComponent,
      domHost: 'hostLeft'
    };
  }

  private getStartingFilterStringProperties(
    currentColumnLevel: number
  ): StartingLevelStringPropertiesInterface {
    switch (currentColumnLevel) {
      case 0:
        return {
          name: 'learningAreas',
          label: 'Leergebieden',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      case 1:
        return {
          name: 'eduNets',
          label: 'Onderwijsnet',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      case 2:
        return {
          name: 'schoolTypes',
          label: 'Stroom',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      case 3:
        return {
          name: 'years',
          label: 'Jaar',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      default:
        throw Error(
          `LearningPlanFilterFactory: getStartingFilterStringProperties: Given currentColumnLevel: ${currentColumnLevel} should not exist`
        );
    }
  }

  private getStartingLevelSearchFilterCriteria(
    propertyId: number,
    startingColumnValues
  ): SearchFilterCriteriaInterface {
    return {
      name: 'naam', //TODO -- add switch
      label: 'label', //TODO -- add switch
      keyProperty: 'id', //TODO -- check if always the same, otherwise add switch
      displayProperty: 'name', //TODO -- check if always the same, othewise add switch
      values: this.getStartingLevelSearchFilterCriteriaValues(
        currentColumnLevel,
        propertyId,
        startingColumnValues
      )
    };
  }

  private getStartingLevelSearchFilterCriteriaValues(
    currentColumnLevel: number,
    propertyId: number,
    startingColumnValues: any
  ): SearchFilterCriteriaValuesInterface[] {
    return startingColumnValues.map(value => {
      //TODO -- map this to value interfaces, we probebly need more data here to
      // return {
      //   data: value,
      //   selected?: boolean;
      //   prediction?: number;
      //   visible?: boolean;
      //   child?: SearchFilterCriteriaInterface;
      //   hasChild?: boolean;
      // }
    });
  }

  private getDeepFilters(
    startingColumnIds: [number, number, number],
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    throw new Error('Method not implemented.');
  }

  private getStartingColumnSelectedIds(
    searchState: SearchStateInterface
  ): StartinColumnIdsType {
    const learningAreas = searchState.filterCriteriaSelections.get(
      'learningAreas'
    );
    const eduNets = searchState.filterCriteriaSelections.get('eduNets');
    const schoolTypes = searchState.filterCriteriaSelections.get('schoolTypes');
    const years = searchState.filterCriteriaSelections.get('years');
    return [
      typeof learningAreas[0] === 'string'
        ? parseInt(learningAreas[0] as string, 10)
        : (learningAreas[0] as number),
      typeof eduNets[0] === 'string'
        ? parseInt(eduNets[0] as string, 10)
        : (eduNets[0] as number),
      typeof schoolTypes[0] === 'string'
        ? parseInt(schoolTypes[0] as string, 10)
        : (schoolTypes[0] as number),
      typeof years[0] === 'string'
        ? parseInt(schoolTypes[0] as string, 10)
        : (schoolTypes[0] as number)
    ];
  }

  private getColumnLevel([
    learningAreaId,
    eduNetId,
    schoolTypeId,
    yearId
  ]: StartinColumnIdsType): number {
    if (learningAreaId && eduNetId && schoolTypeId && yearId) return 4;
    if (learningAreaId && eduNetId && schoolTypeId) return 3;
    if (learningAreaId && eduNetId) return 2;
    if (learningAreaId) return 1;
    return 0;
  }

  // private getYears(searchState: SearchStateInterface): YearInterface[] {

  //   return this.learningPlanService.getAvailableYearsForSearch(
  //     learningArea,
  //     eduNet,
  //     schoolType
  //   ).pipe(
  //     map((years: any[]) => {
  //       return years as number[]
  //     });
  //   );
  // }
}

interface StartingLevelStringPropertiesInterface {
  name: string;
  label: string;
  keyProperty: string;
  displayProperty: string;
}

type StartinColumnIdsType = [number, number, number, number];
