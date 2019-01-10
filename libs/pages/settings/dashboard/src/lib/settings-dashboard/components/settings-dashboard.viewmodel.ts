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
  links: Observable<Link[]> = of([
    {
      name: 'Mijn gegevens',
      url: 'gegevens',
      icon: 'settings',
      permissions: [SettingsPermissions.UPDATE_PROFILE]
    },
    {
      name: 'Verander profielfoto',
      url: 'profile',
      icon: 'user',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      name: 'Mijn koppelingen',
      url: 'koppelingen',
      icon: 'link',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      name: 'Mijn leerkrachten',
      url: 'leerkrachten',
      icon: 'student2',
      permissions: [
        SettingsPermissions.LINK_TEACHERS,
        SettingsPermissions.UNLINK_TEACHERS
      ]
    },
    {
      name: 'Meldingen',
      url: 'Meldingen',
      icon: 'bell',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    }
  ]);

  constructor() {}
}
