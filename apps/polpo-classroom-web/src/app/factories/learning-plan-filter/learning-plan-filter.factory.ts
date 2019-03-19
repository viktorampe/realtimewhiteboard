import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  EduNetInterface,
  EduNetQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  LearningPlanInterface,
  LearningPlanServiceInterface,
  LEARNING_PLAN_SERVICE_TOKEN,
  SchoolTypeInterface,
  SchoolTypeQueries,
  SpecialtyInterface,
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
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LearningPlanFilterFactory implements SearchFilterFactory {
  private componentType = ColumnFilterComponent;
  private domHostValue = 'hostLeft';
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

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const startingColumnIds = this.getStartingColumnSelectedIds(searchState);
    const columnLevel = this.getColumnLevel(startingColumnIds);
    return this.getSearchFilters(startingColumnIds, columnLevel);
  }

  private getSearchFilters(
    selectedPropertyIds: SelectedPropertyIds,
    columnLevel: number
  ): Observable<SearchFilterInterface[]> {
    const years$: Observable<YearInterface[]> =
      columnLevel >= 3
        ? this.learningPlanService.getAvailableYearsForSearch(
            selectedPropertyIds[0],
            selectedPropertyIds[1],
            selectedPropertyIds[2]
          )
        : of(undefined);
    const learningPlans$: Observable<
      Map<SpecialtyInterface, LearningPlanInterface[]>
    > =
      columnLevel >= 4
        ? this.learningPlanService.getLearningPlanAssignments(
            selectedPropertyIds[1],
            selectedPropertyIds[3],
            selectedPropertyIds[2],
            selectedPropertyIds[0]
          )
        : of(undefined);
    return combineLatest(
      this.learningAreas$,
      this.eduNets$,
      this.schoolTypes$,
      years$,
      learningPlans$
    ).pipe(
      map(
        (
          columnValuesData: [
            LearningAreaInterface[],
            EduNetInterface[],
            SchoolTypeInterface[],
            YearInterface[],
            Map<SpecialtyInterface, LearningPlanInterface[]>
          ]
        ) => {
          const searchFilters: SearchFilterInterface[] = [];
          for (let i = 0; i <= columnLevel; i++) {
            searchFilters.push(this.getSearchFilter(i, columnValuesData[i]));
          }
          return searchFilters;
        }
      )
    );
  }

  private getSearchFilter(
    currentColumnLevel: number,
    startingColumnValues
  ): SearchFilterInterface {
    return {
      criteria: this.getSearchFilterCriteria(
        startingColumnValues,
        this.getSearchFilterStringProperties(currentColumnLevel),
        currentColumnLevel < 4
          ? this.getSearchFilterCriteriaValues
          : this.getLearningPlanSearchFilterCriteriaValues
      ),
      component: this.componentType,
      domHost: this.domHostValue
    };
  }

  private getSearchFilterCriteria(
    startingColumnValues,
    stringProperties: StartingLevelStringPropertiesInterface,
    valueGetterFunction: Function
  ): SearchFilterCriteriaInterface {
    return {
      ...stringProperties,
      values: valueGetterFunction(startingColumnValues)
    };
  }

  private getSearchFilterCriteriaValues(
    startingColumnValues: any[]
  ): SearchFilterCriteriaValuesInterface[] {
    return startingColumnValues.map(value => {
      return {
        data: value,
        hasChild: true
      };
    });
  }

  private getLearningPlanSearchFilterCriteriaValues(
    learningPlanMap: Map<SpecialtyInterface, LearningPlanInterface[]>
  ): SearchFilterCriteriaValuesInterface[] {
    return Array.from(learningPlanMap).map(
      ([specialty, learningPlans]: [
        SpecialtyInterface,
        LearningPlanInterface[]
      ]) => {
        return {
          data: { label: specialty.name, ids: learningPlans.map(a => a.id) },
          hasChild: false
        };
      }
    );
  }

  private getStartingColumnSelectedIds(
    searchState: SearchStateInterface
  ): SelectedPropertyIds {
    const learningAreas = searchState.filterCriteriaSelections.get(
      'learningAreas'
    );
    const eduNets = searchState.filterCriteriaSelections.get('eduNets');
    const schoolTypes = searchState.filterCriteriaSelections.get('schoolTypes');
    const years = searchState.filterCriteriaSelections.get('years');
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
  ]: SelectedPropertyIds): number {
    if (learningAreaId && eduNetId && schoolTypeId && yearId) return 4;
    if (learningAreaId && eduNetId && schoolTypeId) return 3;
    if (learningAreaId && eduNetId) return 2;
    if (learningAreaId) return 1;
    return 0;
  }

  private getSearchFilterStringProperties(
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
      case 4:
        return {
          name: 'learningPlans.assignments',
          label: 'Leerplan',
          keyProperty: 'ids',
          displayProperty: 'label'
        };
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
