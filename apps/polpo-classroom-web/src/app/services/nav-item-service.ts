import { Injectable } from '@angular/core';
import {
  FavoriteInterface,
  PassportUserCredentialInterface,
  PersonInterface
} from '@campus/dal';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class NavItemService {
  private standardNavItems: Dictionary<NavItem> = {
    taken: { title: 'Taken', icon: 'task', link: '/tasks' },
    boeken: { title: 'Boeken', icon: 'book', link: '/books' },
    bundels: { title: 'Bundels', icon: 'bundles', link: '/bundles' },
    resultaten: {
      title: 'Resultaten',
      icon: 'increase',
      link: '/reports'
    },
    settings: { title: 'Instellingen', icon: 'settings', link: '/settings' },
    bordboeken: { title: 'Bordboeken', icon: 'book', link: '/books' },
    lesmateriaal: {
      title: 'Lesmateriaal',
      icon: 'lesmateriaal',
      link: '/edu-content'
    },
    leerlingen: {
      title: 'Leerlingen',
      icon: 'student2',
      link: '/students'
    },
    help: {
      title: 'Veelgestelde vragen',
      icon: 'help',
      link: 'https://www.polpo.be/veelgestelde-vragen'
    }
  };

  private standardProfileMenuItems: Dictionary<DropdownMenuItemInterface> = {
    profiel: {
      description: 'Profiel',
      icon: 'account',
      internalLink: '/settings/profile',
      dividerBefore: false
    }, // icon-user in current site
    afmelden: {
      description: 'Afmelden',
      icon: 'lock',
      internalLink: '/logout',
      dividerBefore: true
    }, // icon-key in current site
    smartschool: {
      // description will be added later
      image: '/assets/images/icon-smartschool.png',
      // link will be added later
      dividerBefore: false
    }
  };

  public getSideNavItems(
    user: PersonInterface,
    favorites: FavoriteInterface[]
  ): NavItem[] {
    const navItems: NavItem[] = [];

    /*
      Het is op dit moment nog niet helemaal duidelijk op welke basis
      zal beslist worden wie welke items te zien krijgt.
      Nu: hardcoded items toevoegen voor students
    */
    if (user.roles.some(role => role.name === 'student')) {
      navItems.push(
        { ...this.standardNavItems.bundels },
        { ...this.standardNavItems.taken },
        { ...this.standardNavItems.boeken },
        { ...this.standardNavItems.resultaten },
        { ...this.standardNavItems.settings }
      );
    }

    if (user.roles.some(role => role.name === 'teacher')) {
      const favoritesNavItems = favorites.map(
        (favorite): NavItem => ({
          title: favorite.learningArea.name,
          icon: favorite.learningArea.icon,
          link: favorite.learningAreaId.toString() // will be appended later
        })
      );

      navItems.push(
        this.withFavorites(
          { ...this.standardNavItems.lesmateriaal },
          favoritesNavItems
        ),
        this.withFavorites(
          { ...this.standardNavItems.bundels },
          favoritesNavItems
        ),
        this.withFavorites(
          { ...this.standardNavItems.taken },
          favoritesNavItems
        ),
        this.withFavorites(
          { ...this.standardNavItems.boeken },
          favoritesNavItems
        ),
        { ...this.standardNavItems.resultaten }
      );
    }

    return navItems;
  }

  public getProfileMenuItems(
    user: PersonInterface,
    credentials: PassportUserCredentialInterface[]
  ): DropdownMenuItemInterface[] {
    return [
      this.standardProfileMenuItems.profiel,
      ...this.getSmartschoolProfileMenuItems(credentials),
      this.standardProfileMenuItems.afmelden
    ];
  }

  private withFavorites(navItem: NavItem, favorites: NavItem[]): NavItem {
    const children = favorites.map(fav => ({
      ...fav,
      icon: fav.icon.startsWith('learning-area:')
        ? fav.icon
        : 'learning-area:' + fav.icon,
      link: navItem.link + '/' + fav.link
    }));

    navItem.children = children;

    return navItem;
  }

  private getSmartschoolProfileMenuItems(
    credentials: PassportUserCredentialInterface[]
  ): DropdownMenuItemInterface[] {
    const smartschoolCredentials = credentials.filter(
      cred => cred.provider === 'smartschool'
    );

    if (smartschoolCredentials.length === 0) return [];

    const smartschoolLinks = smartschoolCredentials.map(
      smartschoolCredential => ({
        ...this.standardProfileMenuItems.smartschool,
        description: this.extractPlatformName(
          smartschoolCredential.profile.platform
        ),
        externalLink:
          smartschoolCredential.profile.platform || 'https://www.smartschool.be'
      })
    );

    //only add divider on first smartschool-link
    smartschoolLinks[0].dividerBefore = true;

    return smartschoolLinks;
  }

  private extractPlatformName(platformUrl: string) {
    return platformUrl
      ? platformUrl.replace('.smartschool.be', '').replace('https://', '')
      : 'smartschool';
  }
}
