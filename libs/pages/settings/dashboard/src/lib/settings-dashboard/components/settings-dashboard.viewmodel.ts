import { Injectable } from '@angular/core';
import { SettingsPermissions } from '@campus/dal';
import { Observable, of } from 'rxjs';

export interface Link {
  url: string;
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
      url: '../../profile',
      icon: 'settings',
      permissions: [SettingsPermissions.UPDATE_PROFILE]
    },
    {
      name: 'Verander profielfoto',
      url: '../../avatar',
      icon: 'user',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      name: 'Mijn koppelingen',
      url: '../../credentials',
      icon: 'link',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      name: 'Mijn leerkrachten',
      url: '../../coupled-teachers',
      icon: 'student2',
      permissions: [
        SettingsPermissions.LINK_TEACHERS,
        SettingsPermissions.UNLINK_TEACHERS
      ]
    },
    {
      name: 'Meldingen',
      url: '../../alerts',
      icon: 'bell',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    }
  ]);

  constructor() {}
}
