import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  LinkedPersonActions,
  LinkedPersonQueries,
  PersonActions,
  PersonInterface,
  PersonQueries,
  RoleInterface,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, skipWhile, switchMapTo, tap } from 'rxjs/operators';

export enum RolesEnum {
  Teacher = 'teacher',
  Student = 'student'
}

@Injectable()
export class CoupledTeacherGuard implements CanActivate {
  //input streams
  private currentUser$: Observable<PersonInterface>;
  private personQueriesLoaded$: Observable<boolean>;
  private linkedPersonsLoaded$: Observable<boolean>;
  //intermediate streams
  private isTeacher$: Observable<boolean>;
  private isStudent$: Observable<boolean>;
  private hasTeachers$: Observable<boolean>;

  constructor(
    private store: Store<DalState>,
    private router: Router,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.initialiseInputStreams();
    this.loadIntermediateStream();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentUser$.pipe(
      skipWhile(currentUser => currentUser === null),
      tap(() => {
        this.dispatchLoadActions();
      }),
      switchMapTo(
        combineLatest(this.personQueriesLoaded$, this.linkedPersonsLoaded$)
      ),
      skipWhile(([personQueriesLoaded, linkedPersonsLoaded]) => {
        return !linkedPersonsLoaded || !personQueriesLoaded;
      }),
      switchMapTo(
        combineLatest(this.isStudent$, this.isTeacher$, this.hasTeachers$)
      ),
      map(([isStudent, isTeacher, hasTeachers]) => {
        if (isStudent && !isTeacher && hasTeachers) return true;
        this.router.navigate(['/settings']);
        return false;
      })
    );
  }

  private dispatchLoadActions(): void {
    this.store.dispatch(
      new LinkedPersonActions.LoadLinkedPersons({
        userId: this.authService.userId
      })
    );
    this.store.dispatch(
      new PersonActions.LoadPersons({
        userId: this.authService.userId
      })
    );
  }

  private initialiseInputStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.linkedPersonsLoaded$ = this.store.pipe(
      select(LinkedPersonQueries.getLoaded)
    );
    this.personQueriesLoaded$ = this.store.pipe(
      select(PersonQueries.getLoaded)
    );
  }

  private loadIntermediateStream(): void {
    this.isStudent$ = this.currentUser$.pipe(
      map(currentUser => {
        if (!currentUser) return false;
        return this.containsRole(currentUser.roles, RolesEnum.Student);
      })
    );
    this.isTeacher$ = this.currentUser$.pipe(
      map(currentUser => {
        if (!currentUser) return false;
        return this.containsRole(currentUser.roles, RolesEnum.Teacher);
      })
    );
    this.hasTeachers$ = this.currentUser$.pipe(
      map(currentUser => {
        if (!currentUser) return false;
        return currentUser.teachers ? currentUser.teachers.length > 0 : false;
      })
    );
  }

  private containsRole(
    personRoles: RoleInterface[],
    desiredRole: RolesEnum
  ): boolean {
    if (!personRoles) return false;
    return personRoles.some(role => role.name === desiredRole);
  }
}
