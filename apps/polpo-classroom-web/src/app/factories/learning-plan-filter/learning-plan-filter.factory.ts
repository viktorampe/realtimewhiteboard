
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

}
