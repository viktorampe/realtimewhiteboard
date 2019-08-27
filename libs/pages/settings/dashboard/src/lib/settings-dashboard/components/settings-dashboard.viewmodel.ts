import { Injectable } from '@angular/core';
import { SettingsPermissions } from '@campus/dal';
import { Observable, of } from 'rxjs';

export interface Link {
  url: string[];
  name: string;
  icon: string;
  permissions?: SettingsPermissions[];
}

@Injectable({
  providedIn: 'root'
})
export class SettingsDashboardViewModel {
  links$: Observable<Link[]> = of([
    {
      name: 'Mijn gegevens',
      url: ['/settings', 'profile'],
      icon: 'profile',
      permissions: [SettingsPermissions.UPDATE_PROFILE]
    },
    {
      name: 'Verander profielfoto',
      url: ['/settings', 'profile', 'avatar'],
      icon: 'avatar',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      name: 'Mijn koppelingen',
      url: ['/settings', 'credentials'],
      icon: 'credentials',
      permissions: [SettingsPermissions.ADD_CREDENTIALS]
    },
    {
      name: 'Mijn leerkrachten',
      url: ['/settings', 'coupled-teachers'],
      icon: 'coupled-teachers',
      permissions: [
        SettingsPermissions.LINK_TEACHERS,
        SettingsPermissions.UNLINK_TEACHERS
      ]
    },
    {
      name: 'Meldingen',
      url: ['/settings', 'alerts'],
      icon: 'notifications',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    }
  ]);

  constructor() {}
}
