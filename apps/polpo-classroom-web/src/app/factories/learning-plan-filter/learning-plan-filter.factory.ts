
@Injectable({ providedIn: 'root' })
export class LearningPlanFilterFactory implements SearchFilterFactory {
  learningAreas$: Observable<LearningAreaInterface[]>;
  eduNets$: Observable<EduNetInterface[]>;
  schoolTypes$: Observable<SchoolTypeInterface[]>;
  years$: Observable<YearInterface[]>;

  constructor(
    private store: Store<DalState>,
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
    return null;
  }

  private getStartingColumnIds(
    searchState: SearchStateInterface
  ): [number, number, number] {
    const learningAreas = searchState.filterCriteriaSelections.get(
      'learningArea'
    );
    const eduNets = searchState.filterCriteriaSelections.get('eduNet');
    const schoolTypes = searchState.filterCriteriaSelections.get('schoolType');
    return [
      learningAreas[0] as number,
      eduNets[0] as number,
      schoolTypes[0] as number
    ];
  }

  private getColumnLevel([learningAreaId, eduNetId, schoolTypeId]: [
    number,
    number,
    number
  ]) {
    if (learningAreaId && eduNetId && schoolTypeId) return 3;
    if (learningAreaId && eduNetId) return 2;
    if (learningAreaId) return 1;
    return 0;
  }
}
