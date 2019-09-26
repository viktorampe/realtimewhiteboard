import { Component, OnInit } from '@angular/core';
import { BadgePersonInterface, NavItem } from '@campus/ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsDashboardViewModel } from './settings-dashboard.viewmodel';

@Component({
  selector: 'campus-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent implements OnInit {
  links$: Observable<NavItem[]> = this.viewModel.links$;
  useNavItemStyle: boolean = this.viewModel.environmentUi.useNavItemStyle;

  user$: Observable<{
    badgeInfo: BadgePersonInterface;
    subText: string;
  }>;

  constructor(private viewModel: SettingsDashboardViewModel) {}

  ngOnInit() {
    this.user$ = this.viewModel.user$.pipe(
      map(user => ({
        badgeInfo: {
          displayName: user.displayName,
          name: user.name,
          firstName: user.firstName,
          avatar: user.avatar
        },
        subText: this.getUserTypeTranslation(user.roles).join(' - ')
      }))
    );
  }

  private getUserTypeTranslation(roles: { name: string }[]): string[] {
    return roles.map(role => translateRole(role.name));

    function translateRole(role: string) {
      switch (role) {
        case 'teacher':
          return 'Leerkracht';
        case 'student':
          return 'Leerling';
        case 'schooladmin':
          return 'Beheerder';
        default:
          return 'Medewerker';
      }
    }
  }
}
