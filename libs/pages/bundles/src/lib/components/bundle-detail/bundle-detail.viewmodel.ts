import { Injectable } from '@angular/core';
import {
  BundleInterface,
  ContentInterface,
  ContentType,
  EduContentInterface,
  UserContentInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ContentAction } from './bundle-detail-classes';

@Injectable({
  providedIn: 'root'
})
export class BundleDetailViewModel {
  selectedBundle$ = this.getMockBundle();

  bundleContents$ = combineLatest(
    this.getMockEducontents().pipe(
      map(eduC => this.mapEduContentToContentInterface(eduC))
    ),
    this.getMockUsercontents().pipe(
      map(userC => this.mapUserContentToContentInterface(userC))
    )
  );
  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  private getMockBundle(): Observable<BundleInterface> {
    const bundle = {
      icon: 'icon-tasks',
      name: 'Algemeen',
      description: 'Dit is een subtitel',
      start: new Date('2018-09-01 00:00:00'),
      end: new Date('2018-09-01 00:00:00'),
      learningArea: {
        name: 'Aardrijkskunde',
        icon: 'polpo-aardrijkskunde',
        color: '#485235'
      },
      teacher: {
        firstName: 'Ella',
        name: 'Kuipers',
        email: 'teacher2@mailinator.com'
      }
    };

    return of(bundle);
  }

  private getMockEducontents(): Observable<EduContentInterface> {
    const eduContent = {
      type: 'boek-e',
      publishedEduContentMetadata: {
        version: 1,
        metaVersion: '0.1',
        language: 'be',
        title: 'De wereld van de getallen',
        description: 'Lorem ipsum dolor sit amet ... ',
        created: new Date('2018-09-04 14:21:19'),
        fileName: 'EXT_powerpoint_meetkunde.ppt',
        thumbSmall: 'https://www.polpo.be/assets/images/home-laptop-books.jpg',
        methods: [
          { name: 'Beautemps', icon: 'beautemps', logoUrl: 'beautemps.svg' },
          { name: 'Kapitaal', icon: 'kapitaal', logoUrl: 'kapitaal.svg' }
        ]
      }
    };
    return of(eduContent);
  }

  private getMockUsercontents(): Observable<UserContentInterface> {
    const userContent = {
      type: 'link',
      name: 'Omschrijving thesis 0',
      description: 'Omschrijving vereisten voor thesis op google drive',
      link: 'http://www.google.be?q=thesisomschrijving',
      teacher: {
        firstName: 'Ella',
        name: 'Kuipers',
        email: 'teacher2@mailinator.com'
      }
    };
    return of(userContent);
  }

  private getExtension(fileName: string) {
    return fileName.substring(fileName.lastIndexOf('.') + 1);
  }

  private mapEduContentToContentInterface(
    eduContent: EduContentInterface
  ): ContentInterface {
    return {
      name: eduContent.publishedEduContentMetadata.title,
      type: ContentType.EDUCONTENT,
      productType: eduContent.type,
      fileExtension: this.getExtension(
        eduContent.publishedEduContentMetadata.fileName
      ),
      previewImage: eduContent.publishedEduContentMetadata.thumbSmall,
      description: eduContent.publishedEduContentMetadata.description,
      methodLogos: eduContent.publishedEduContentMetadata.methods.map(
        m => m.icon
      ),
      actions: [
        new ContentAction({
          text: 'Action tekst 1a',
          icon: 'icon-tasks'
        }),
        new ContentAction({
          text: 'Action tekst 2a',
          icon: 'icon-book'
        })
      ],
      status: { label: 'test' }
    };
  }
  private mapUserContentToContentInterface(
    userContent: UserContentInterface
  ): ContentInterface {
    return {
      name: userContent.name,
      type: ContentType.USERCONTENT,
      productType: userContent.type,
      fileExtension: 'drive',
      description: userContent.description,
      actions: [
        new ContentAction({
          text: 'Action tekst 1a',
          icon: 'icon-tasks'
        }),
        new ContentAction({
          text: 'Action tekst 2a',
          icon: 'icon-book'
        })
      ],
      status: { label: 'test' }
    };
  }
}
