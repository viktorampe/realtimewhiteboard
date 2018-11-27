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
import { map } from 'rxjs/operators';

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
      this.isStudent$,
      this.isTeacher$,
      this.hasTeachers$
    ).pipe(
      map(([isStudent, isTeacher, hasTeachers]) => {
        if (isStudent && !isTeacher && hasTeachers) return true;
        this.router.navigate(['/settings']);
        return false;
      })
    );
  }

  private initialiseInputStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
  }

  private loadIntermediateStream(): void {
    this.isStudent$ = this.currentUser$.pipe(
      map(currentUser =>
        this.containsRole(currentUser.roles, RolesEnum.Student)
      )
    );
    this.isTeacher$ = this.currentUser$.pipe(
      map(currentUser =>
        this.containsRole(currentUser.roles, RolesEnum.Teacher)
      )
    );
    this.hasTeachers$ = this.currentUser$.pipe(
      map(currentUser => currentUser.teachers.length > 0)
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
