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
      url: ['/settings', 'profile'],
      icon: 'profile',
      permissions: [SettingsPermissions.UPDATE_PROFILE]
    },
    {
      name: 'Verander profielfoto',
      url: ['/settings', 'avatar'],
      icon: 'avatar',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      name: 'Mijn koppelingen',
      url: ['/settings', 'credentials'],
      icon: 'credentials',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
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
      icon: 'bell',
      permissions: [SettingsPermissions.UPDATE_AVATAR]
    }
  ]);
}
