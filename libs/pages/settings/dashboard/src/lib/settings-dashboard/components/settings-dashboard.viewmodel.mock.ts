import { Injectable } from '@angular/core';
import { SettingsPermissions } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { Observable, of } from 'rxjs';
import {
  Link,
  SettingsDashboardViewModel
} from './settings-dashboard.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockSettingsDashboardViewModel
  implements ViewModelInterface<SettingsDashboardViewModel> {
  links$: Observable<Link[]> = of([
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
}
