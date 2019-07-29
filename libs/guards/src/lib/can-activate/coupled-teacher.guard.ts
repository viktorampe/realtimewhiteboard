import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {
  DalState,
  LinkedPersonActions,
  LinkedPersonQueries,
  PersonInterface,
  RoleInterface,
  TeacherStudentActions,
  TeacherStudentQueries,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, skipWhile, switchMap, switchMapTo, tap } from 'rxjs/operators';

export enum RolesEnum {
  Teacher = 'teacher',
  Student = 'student'
}

@Injectable()
export class CoupledTeacherGuard implements CanActivate {
  //input streams
  private currentUser$: Observable<PersonInterface>;
  private personsLoaded$: Observable<boolean>;
  private teacherStudentLoaded$: Observable<boolean>;
  private linkedPersonsIds$: Observable<number[]>;
  //intermediate streams
  private isTeacher$: Observable<boolean>;
  private isStudent$: Observable<boolean>;
  private hasTeachers$: Observable<boolean>;

  constructor(private store: Store<DalState>, private router: Router) {
    this.initialiseInputStreams();
    this.loadIntermediateStream();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentUser$.pipe(
      skipWhile(currentUser => currentUser === null),
      tap(currentUser => {
        this.dispatchLoadActions(currentUser.id);
      }),
      switchMapTo(
        combineLatest([this.personsLoaded$, this.teacherStudentLoaded$])
      ),
      skipWhile(arr => !arr.every(Boolean)),
      switchMapTo(
        combineLatest([this.isTeacher$, this.isStudent$, this.hasTeachers$])
      ),
      map(([isTeacher, isStudent, hasTeachers]) => {
        if (isTeacher) return true;
        if (isStudent && hasTeachers) return true;
        this.router.navigate(['/settings/coupled-teachers']);
        return false;
      })
    );
  }

  private dispatchLoadActions(currentUserId: number): void {
    this.store.dispatch(
      new LinkedPersonActions.LoadLinkedPersons({
        userId: currentUserId
      })
    );
    this.store.dispatch(
      new TeacherStudentActions.LoadTeacherStudents({
        userId: currentUserId
      })
    );
  }

  private initialiseInputStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.teacherStudentLoaded$ = this.store.pipe(
      select(TeacherStudentQueries.getLoaded)
    );
    this.personsLoaded$ = this.store.pipe(
      select(LinkedPersonQueries.getLoaded)
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
      switchMap(user =>
        this.store.pipe(
          select(TeacherStudentQueries.getCoupledTeacherIds, {
            userId: user.id
          })
        )
      ),
      //this will need to be changed once the role setup will be changed
      switchMap(teacherStudentIds =>
        this.store.pipe(
          select(LinkedPersonQueries.getByIds, {
            ids: teacherStudentIds
          })
        )
      ),
      map(linkedPersons =>
        linkedPersons.some(
          linkedPerson => linkedPerson.type === RolesEnum.Teacher
        )
      )
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
