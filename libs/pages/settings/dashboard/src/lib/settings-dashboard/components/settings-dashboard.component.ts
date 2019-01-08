import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceInterface, AUTH_SERVICE_TOKEN } from '@campus/dal';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Link {
  url: string;
  name: string;
  icon: string;
  permissions?: string[];
}

@Component({
  selector: 'campus-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent implements OnInit {
  //TODO replace with viewmodel
  links: Observable<Link[]> = of([
    { name: 'link1', url: 'test1', icon: 'menu', permissions: ['permission1'] },
    {
      name: 'link3',
      url: 'test3dasdf',
      icon: 'menu',
      permissions: ['permission2']
    },
    { name: 'link4asdfasdf', url: 'test4asdffasdf', icon: 'menu' },
    { name: 'link5asdfasdfasf', url: 'test5asdfasdfasfd', icon: 'menu' },
    { name: 'link6', url: 'test6', icon: 'menu' },
    { name: 'link7', url: 'test7', icon: 'menu' },
    { name: 'link8', url: 'test8', icon: 'menu' }
  ]);

  constructor(
    private router: Router,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}

  hasPermission(permissions: string[]): Observable<boolean> {
    if (permissions) {
      this.authService.getPermissions().pipe(
        map(userPermissions => {
          for (const permission in permissions) {
            if (!userPermissions.includes(permission)) {
              return false;
            }
          }
          return true;
        })
      );
    }
    return of(true);
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {}
}
