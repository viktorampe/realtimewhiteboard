import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  EduNetInterface,
  EduNetQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  LearningPlanAssignmentInterface,
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
    const startingColumnIds = this.getStartingColumnSelectedIds(searchState);
    const columnLevel = this.getColumnLevel(startingColumnIds);
    const deepSearchFilterStream =
      columnLevel > 3
        ? this.getDeepFilters(startingColumnIds, searchState)
        : of([]);
    return combineLatest(
      this.getStartingFilters(startingColumnIds, columnLevel),
      deepSearchFilterStream
    ).pipe(
      map(
        ([startingSearchFitlers, deepSearchFilters]: [
          SearchFilterInterface[],
          SearchFilterInterface[]
        ]) => {
          return [...startingSearchFitlers, ...deepSearchFilters];
        }
      )
    );
  }

  private getStartingFilters(
    startingColumnIds: StartinColumnIdsType,
    columnLevel: number
  ): Observable<SearchFilterInterface[]> {
    const years$ =
      columnLevel >= 3
        ? this.learningPlanService.getAvailableYearsForSearch(
            startingColumnIds[0],
            startingColumnIds[1],
            startingColumnIds[2]
          )
        : of(undefined);
    return combineLatest(
      this.learningAreas$,
      this.eduNets$,
      this.schoolTypes$,
      years$
    ).pipe(
      map(
        (
          startingColumnValues: [
            LearningAreaInterface[],
            EduNetInterface[],
            SchoolTypeInterface[],
            YearInterface[]
          ]
        ) => {
          const startingSearchFilters: SearchFilterInterface[] = [];
          // push the store stream data
          for (let i = 0; i < columnLevel && i < 3; i++) {
            startingSearchFilters.push(
              this.getStartingFilter(
                i,
                startingColumnIds[i],
                startingColumnValues[i]
              )
            );
          }
          // push the years data if needed
          if (startingColumnValues[3]) {
            startingSearchFilters.push(
              this.getStartingFilter(
                3,
                startingColumnIds[3],
                startingColumnValues[3]
              )
            );
          }
          return startingSearchFilters;
        }
      )
    );
  }

  private getStartingFilter(
    currentColumnLevel: number,
    propertyId: number,
    startingColumnValues
  ): SearchFilterInterface {
    return {
      criteria: this.getStartingLevelSearchFilterCriteria(
        propertyId,
        startingColumnValues,
        this.getStartingFilterStringProperties(currentColumnLevel)
      ),
      component: this.componentType,
      domHost: this.domHostValue
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
    startingColumnValues,
    stringProperties: StartingLevelStringPropertiesInterface
  ): SearchFilterCriteriaInterface {
    return {
      name: stringProperties.name,
      label: stringProperties.label,
      keyProperty: stringProperties.keyProperty,
      displayProperty: stringProperties.displayProperty,
      values: this.getStartingLevelSearchFilterCriteriaValues(
        propertyId,
        startingColumnValues,
        stringProperties
      )
    };
  }

  private getStartingLevelSearchFilterCriteriaValues(
    selectedPropertyId: number,
    startingColumnValues: [],
    stringProperties: StartingLevelStringPropertiesInterface
  ): SearchFilterCriteriaValuesInterface[] {
    return startingColumnValues.map(value => {
      return {
        data: value,
        selected:
          selectedPropertyId &&
          value[stringProperties.keyProperty] === selectedPropertyId,
        hasChild: true
      };
    });
  }

  private getDeepFilters(
    startingColumnIds: StartinColumnIdsType,
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return this.learningPlanService
      .getLearningPlanAssignments(
        startingColumnIds[1],
        startingColumnIds[3],
        startingColumnIds[2],
        startingColumnIds[0]
      )
      .pipe(
        map(
          (
            learningPlanAssignmentMap: Map<
              SpecialtyInterface,
              LearningPlanAssignmentInterface[]
            >
          ) => {
            const ding: SearchFilterInterface[] = [];
            learningPlanAssignmentMap.forEach((value, key) => {
              ding.push({
                criteria: this.getDeepLevelSearchFilterCriteria(key, value), //TODO -- i think this will return an array of SearchFilterCriteriaInterface s but i don't think the component can display an array
                component: this.componentType,
                domHost: this.domHostValue
              });
            });
            return null;
          }
        )
      );
  }
  getDeepLevelSearchFilterCriteria(
    //TODO -- under construction
    key: SpecialtyInterface,
    values: LearningPlanAssignmentInterface[]
  ): SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[] {
    return {
      name: 'learningPlans.assignments',
      label: 'Plan',
      keyProperty: 'who knows amirite',
      displayProperty: 'id', //TODO -- i guess
      values: this.getDeepLevelSearchFilterCriteriaValues(key, values)
    };
  }
  getDeepLevelSearchFilterCriteriaValues(
    //TODO -- under construction
    key: SpecialtyInterface,
    values: LearningPlanAssignmentInterface[]
  ): SearchFilterCriteriaValuesInterface[] {
    return values.map(value => {
      return {
        data: value,
        selected:
          value.specialty.id === key.id && value.specialty.name === key.name, //TODO -- probably wrong
        hasChild: true //TODO -- don't think this can be right
      };
    });
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
}

interface StartingLevelStringPropertiesInterface {
  name: string;
  label: string;
  keyProperty: string;
  displayProperty: string;
}

type StartinColumnIdsType = [number, number, number, number];
