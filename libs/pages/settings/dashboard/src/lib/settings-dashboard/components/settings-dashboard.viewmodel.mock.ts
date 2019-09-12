import { Injectable } from '@angular/core';
import { SettingsPermissions } from '@campus/dal';
import { NavItem } from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import { Observable, of } from 'rxjs';
import { SettingsDashboardViewModel } from './settings-dashboard.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockSettingsDashboardViewModel
  implements ViewModelInterface<SettingsDashboardViewModel> {
  links$: Observable<NavItem[]> = of([
    {
      title: 'Mijn gegevens',
      link: ['/settings', 'profile'],
      icon: 'profile',
      requiredPermissions: [SettingsPermissions.UPDATE_PROFILE]
    },
    {
      title: 'Verander profielfoto',
      link: ['/settings', 'avatar'],
      icon: 'avatar',
      requiredPermissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      title: 'Mijn koppelingen',
      link: ['/settings', 'credentials'],
      icon: 'credentials',
      requiredPermissions: [SettingsPermissions.UPDATE_AVATAR]
    },
    {
      title: 'Mijn leerkrachten',
      link: ['/settings', 'coupled-teachers'],
      icon: 'coupled-teachers',
      requiredPermissions: [
        SettingsPermissions.LINK_TEACHERS,
        SettingsPermissions.UNLINK_TEACHERS
      ]
    },
    {
      title: 'Meldingen',
      link: ['/settings', 'alerts'],
      icon: 'bell',
      requiredPermissions: [SettingsPermissions.UPDATE_AVATAR]
    }
  ]);
}
