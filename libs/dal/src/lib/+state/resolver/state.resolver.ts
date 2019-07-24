import { ActivatedRouteSnapshot, Params, Resolve } from '@angular/router';
import { DalState } from '@campus/dal';
import { Action, select, Selector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

/**
 * 1. the injectable decorator NEEDS to be added to the extending class
 * 2. custom resolvers extending from this class NEED to call super in their own constructor.
 * even though dependency injection can be private, passing the store to the super will still work
 * 3. return an array of actions and an array of boolean selectors in the abstract methods
 * @example
 * 1.
   `@Injectable({
     providedIn: 'root'
   })
   export class BundlesResolver extends StateResolver {...}`

   2.
   `constructor(
     private store: Store<DalState>,
     @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
     ) {
       super(store);
     }`

   3.
   `protected getLoadableActions(): Action[] {
      return [
        new BundleActions.LoadBundles({ userId: this.authService.userId })
      ];
    }

    protected getResolvedQueries(): Selector<object, boolean>[] {
      return [
        UnlockedBoekeStudentQueries.getLoaded
      ];
    }`
 *
 * @export
 * @abstract
 * @class StateResolver
 * @implements {Resolve<boolean>}
 */
export abstract class StateResolver implements Resolve<boolean> {
  protected params: Params;
  constructor(private superStore: Store<DalState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.params = route.params;
    this.loadActions(this.getLoadableActions());
    return this.actionsLoaded(
      this.getResolvedQueries().map(query =>
        this.superStore.pipe(select(query))
      ),
      this.getStoreSelectionsWithProperties
        ? this.getStoreSelectionsWithProperties()
        : []
    );
  }

  protected abstract getLoadableActions(): Action[];
  protected abstract getResolvedQueries(): Selector<object, boolean>[];
  protected getStoreSelectionsWithProperties?(): Observable<boolean>[];

  private loadActions(actions: Action[]): void {
    actions.forEach(action => {
      this.superStore.dispatch(action);
    });
  }

  private actionsLoaded(
    loaded$: Observable<boolean>[],
    loadedWithProps$: Observable<boolean>[]
  ): Observable<boolean> {
    return combineLatest([...loaded$, ...loadedWithProps$]).pipe(
      map(loadedArray => loadedArray.every(loaded => loaded)),
      filter(loaded => loaded),
      take(1)
    );
  }
}
