import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
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
export class BundleDetailViewModel implements Resolve<boolean> {
  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  getMockBundle(): Observable<Bundle> {
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

  getMockContents(): Observable<Content[]> {
    const item1 = new Content({
      productType: 'icon-bundles',
      fileExtension: 'zip',
      previewImage: 'string',
      title: 'Dit is een titel',
      description: 'Dit is een beschrijving',
      methodLogo: 'vbtl',
      status: 'string',
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
      title: 'Dit is een titel2',
      description: 'Dit is een beschrijving2',
      methodLogo: 'mundo',
      status: 'string',
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
