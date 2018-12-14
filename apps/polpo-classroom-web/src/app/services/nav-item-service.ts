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
    taken: { title: 'Taken', icon: 'taak', link: '/tasks' },
    boeken: { title: 'Boeken', icon: 'book', link: '/books' },
    bundels: { title: 'Bundels', icon: 'lesmateriaal', link: '/bundles' },
    resultaten: {
      title: 'Resultaten',
      icon: 'increase',
      link: '/results'
    },
    dashboard: { title: 'Dashboard', icon: 'home', link: '/dashboard' },
    bordboeken: { title: 'Bordboeken', icon: 'book', link: '/books' },
    lesmateriaal: {
      title: 'Lesmateriaal',
      icon: 'lesmateriaal',
      link: '/eduContent'
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
      internalLink: '/profile'
    }, // icon-user in current site
    afmelden: {
      description: 'Afmelden',
      icon: 'lock',
      internalLink: '/logout'
    }, // icon-key in current site
    smartschool: {
      header: 'Ga naar Smartschool',
      // description will be added later
      image: '/assets/images/icon-smartschool.png'
      // link will be added later
    }
  };

  public getSideNavItems(
    user: PersonInterface,
    favorites: FavoriteInterface[]
  ): NavItem[] {
    const navItems: NavItem[] = [];
    if (!user) {
      return navItems;
    }

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
        { ...this.standardNavItems.resultaten }
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
      link: navItem.link + '/' + fav.link
    }));

    navItem.children = children;

    return navItem;
  }

  private getSmartschoolProfileMenuItems(
    credentials: PassportUserCredentialInterface[]
  ): DropdownMenuItemInterface[] {
    return credentials
      .filter(cred => cred.provider === 'smartschool')
      .map(smartschoolCredential => ({
        ...this.standardProfileMenuItems.smartschool,
        description: this.extractPlatformName(
          smartschoolCredential.profile.platform
        ),
        externalLink: smartschoolCredential.profile.platform
      }));
  }

  private extractPlatformName(platformUrl: string) {
    return platformUrl.replace('.smartschool.be', '');
  }
}
