import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceInterface, AUTH_SERVICE_TOKEN } from '@campus/dal';
import { Observable, of } from 'rxjs';

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
    {
      name: 'Mijn gegevens',
      url: 'gegevens',
      icon: 'settings',
      permissions: ['permission1']
    },
    {
      name: 'Verander profielfoto',
      url: 'profile',
      icon: 'user',
      permissions: ['permission2']
    },
    { name: 'Mijn koppelingen', url: 'koppelingen', icon: 'link' },
    {
      name: 'Mijn leerkrachten',
      url: 'leerkrachten',
      icon: 'student2'
    },
    { name: 'Meldingen', url: 'Meldingen', icon: 'bell' }
  ]);
  currentUserPermissions: Observable<string[]>;

  constructor(
    private router: Router,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.currentUserPermissions = authService.getPermissions();
  }

  hasPermission(permissions: string[], userPermissions: string[]): boolean {
    console.log(permissions, userPermissions);
    if (permissions) {
      for (let i = 0; i < permissions.length; i++) {
        console.log(permissions[i]);
        if (!userPermissions.includes(permissions[i])) {
          return false;
        }
      }
      return true;
    }
    return true;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {}
}
