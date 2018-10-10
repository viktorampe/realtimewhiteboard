import { Injectable } from '@angular/core';
import { ListFormat } from '@campus/ui';
import { ContentStatus } from '@diekeure/polpo-api-angular-sdk';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Bundle,
  Content,
  ContentAction,
  Teacher
} from './bundle-detail-classes';

@Injectable({
  providedIn: 'root'
})
export class BundleDetailViewModel {
  selectedBundle$ = this.getMockBundle();
  bundleContents$ = this.getMockContents();
  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  private getMockBundle(): Observable<Bundle> {
    const bundle = new Bundle({
      icon: 'icon-tasks',
      name: 'Dit is een titel',
      description: 'Dit is een subtitel',
      teacher: new Teacher({
        displayName: 'Leerkracht Naam',
        firstName: 'Leerkracht',
        name: 'Naam'
      })
    });

    return of(bundle);
  }

  private getMockContents(): Observable<Content[]> {
    const item1 = new Content({
      productType: 'icon-bundles',
      fileExtension: 'zip',
      previewImage: 'string',
      name: 'Dit is een titel',
      description: 'Dit is een beschrijving',
      methodLogo: 'vbtl',
      status: new ContentStatus(),
      actions: [
        new ContentAction({
          text: 'Action tekst 1a',
          icon: 'icon-tasks'
        }),
        new ContentAction({
          text: 'Action tekst 2a',
          icon: 'icon-book'
        })
      ]
    });

    const item2 = new Content({
      productType: 'icon-bundles',
      fileExtension: 'xlsx',
      previewImage: 'string',
      name: 'Dit is een titel2',
      description: 'Dit is een beschrijving2',
      methodLogo: 'mundo',
      status: new ContentStatus(),
      actions: [
        new ContentAction({
          text: 'Action tekst 1b',
          icon: 'icon-tasks'
        }),
        new ContentAction({
          text: 'Action tekst 2b',
          icon: 'icon-book'
        })
      ]
    });

    const contents: Content[] = [item1, item2, item1, item2];

    return of(contents);
  }
}
