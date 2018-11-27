import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import {
  DalState,
  PersonInterface,
  RoleInterface,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export enum RolesEnum {
  Teacher = 'teacher',
  Student = 'student'
}

@Injectable()
export class CoupledTeacherGuard implements CanLoad {
  //input streams
  private currentUser$: Observable<PersonInterface>;
  //intermediate streams
  private isTeacher$: Observable<boolean>;
  private isStudent$: Observable<boolean>;
  private hasTeachers$: Observable<boolean>;

  constructor(private store: Store<DalState>, private router: Router) {
    this.initialiseInputStreams();
    this.loadIntermediateStream();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return combineLatest(
      this.currentUser$,
      this.isStudent$,
      this.isTeacher$,
      this.hasTeachers$
    ).pipe(
      map(([currentUser, isStudent, isTeacher, hasTeachers]) => {
        if (!currentUser) {
          this.router.navigate(['/login']);
          return false;
        }
        if (isStudent && !isTeacher && hasTeachers) return true;
        this.router.navigate(['/settings']);
        return false;
      })
    );
  }

  private initialiseInputStreams(): void {
    this.currentUser$ = this.store.pipe(
      select(UserQueries.getCurrentUser),
      shareReplay(1)
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
    return personRoles.findIndex(role => {
      return role.name === desiredRole;
    }) > -1
      ? true
      : false;
  }
}
