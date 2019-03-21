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

enum ColumnLevel {
  LEARNING_AREA,
  EDU_NET,
  SCHOOL_TYPE,
  YEAR,
  LEARNING_PLAN
}

@Injectable({ providedIn: 'root' })
export class LearningPlanFilterFactory implements SearchFilterFactory {
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
      columnLevel >= ColumnLevel.YEAR
        ? this.learningPlanService.getAvailableYearsForSearch(
            selectedPropertyIds[ColumnLevel.LEARNING_AREA],
            selectedPropertyIds[ColumnLevel.EDU_NET],
            selectedPropertyIds[ColumnLevel.SCHOOL_TYPE]
          )
        : of(undefined);
    const learningPlans$: Observable<
      Map<SpecialtyInterface, LearningPlanInterface[]>
    > =
      columnLevel >= ColumnLevel.LEARNING_PLAN
        ? this.learningPlanService.getLearningPlanAssignments(
            selectedPropertyIds[ColumnLevel.EDU_NET],
            selectedPropertyIds[ColumnLevel.YEAR],
            selectedPropertyIds[ColumnLevel.SCHOOL_TYPE],
            selectedPropertyIds[ColumnLevel.LEARNING_AREA]
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
      component: ColumnFilterComponent,
      domHost: 'hostLeft'
    };
  }

  private getSearchFilterCriteria(
    startingColumnValues,
    stringProperties: StartingLevelStringPropertiesInterface,
    valueGetterFunction: ValueGetterFunctionType
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
  ]: SelectedPropertyIds): ColumnLevel {
    if (learningAreaId && eduNetId && schoolTypeId && yearId)
      return ColumnLevel.LEARNING_PLAN;
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
        return {
          name: 'learningAreas',
          label: 'Leergebieden',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      case ColumnLevel.EDU_NET:
        return {
          name: 'eduNets',
          label: 'Onderwijsnet',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      case ColumnLevel.SCHOOL_TYPE:
        return {
          name: 'schoolTypes',
          label: 'Stroom',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      case ColumnLevel.YEAR:
        return {
          name: 'years',
          label: 'Jaar',
          keyProperty: 'id',
          displayProperty: 'name'
        };
      case ColumnLevel.LEARNING_PLAN:
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
type ValueGetterFunctionType = (
  input: any[] | Map<SpecialtyInterface, LearningPlanInterface[]>
) => SearchFilterCriteriaValuesInterface[];
