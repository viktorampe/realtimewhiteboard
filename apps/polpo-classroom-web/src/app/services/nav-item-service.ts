import { Injectable } from '@angular/core';
import {
  FavoriteInterface,
  PassportUserCredentialInterface,
  PersonInterface
} from '@campus/dal';
import { NavItem } from '@campus/ui';
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

  private standardProfileMenuItems: Dictionary<NavItem> = {
    profiel: { title: 'Profiel', icon: 'account', link: '/profile' }, // icon-user in current site
    afmelden: { title: 'Afmelden', icon: 'lock', link: '/logout' }, // icon-key in current site
    smartschool: {
      title: 'Ga naar Smartschool',
      icon: 'smartschool:orange'
      // link will be added later
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
      navItems.push(Object.assign({}, this.standardNavItems.bundels));
      navItems.push(Object.assign({}, this.standardNavItems.taken));
      navItems.push(Object.assign({}, this.standardNavItems.boeken));
      navItems.push(Object.assign({}, this.standardNavItems.resultaten));
    }

    if (user.roles.some(role => role.name === 'teacher')) {
      const favoritesNavItems = favorites.map(
        (favoriet): NavItem => ({
          title: favoriet.learningArea.name,
          icon: favoriet.learningArea.icon,
          link: favoriet.learningAreaId.toString() //wordt nog overschreven
        })
      );

      navItems.push(
        this.withFavorites(
          Object.assign({}, this.standardNavItems.bundels),
          favoritesNavItems
        )
      );
      navItems.push(
        this.withFavorites(
          Object.assign({}, this.standardNavItems.taken),
          favoritesNavItems
        )
      );
      navItems.push(
        this.withFavorites(
          Object.assign({}, this.standardNavItems.boeken),
          favoritesNavItems
        )
      );
      navItems.push(Object.assign({}, this.standardNavItems.resultaten));
    }

    console.log('service: getSideNavItems', navItems);
    return navItems;
  }

  public getProfileMenuItems(
    user: PersonInterface,
    credentials: PassportUserCredentialInterface[]
  ): NavItem[] {
    const navItems: NavItem[] = [];
    navItems.push(this.standardProfileMenuItems.profiel);

    if (credentials.length) {
      const smartschoolCredential = credentials.find(
        cred => cred.provider === 'smartschool'
      );
      if (smartschoolCredential) {
        const smartschoolItem = Object.assign(
          {},
          this.standardProfileMenuItems.smartschool
        );
        smartschoolItem.link = smartschoolCredential.profile.platform;
        navItems.push(smartschoolItem);
      }
    }

    navItems.push(this.standardProfileMenuItems.afmelden);

    console.log('service: getProfileMenuItems', navItems);
    return navItems;
  }

  private withFavorites(navItem: NavItem, favorites: NavItem[]): NavItem {
    const children = favorites.map(fav => {
      return { ...fav, link: navItem.link + '/' + fav.link };
    });

    navItem.children = children;

    return navItem;
  }
}
