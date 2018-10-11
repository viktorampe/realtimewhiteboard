import { Injectable } from '@angular/core';
import {
  BundleInterface,
  EduContentInterface,
  UserContentInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DataConverterService } from './services/data-converter.service';

@Injectable({
  providedIn: 'root'
})
export class BundleDetailViewModel {
  selectedBundle$ = this.getMockBundle();

  bundleContents$ = combineLatest(
    // mockdata - Educontents
    this.getMockEducontents().pipe(
      map(educontentsArray =>
        educontentsArray.map(e =>
          this.dataConverter.mapEduContentToContentInterface(e)
        )
      )
    ),
    // mockdata - Usercontents
    this.getMockUsercontents().pipe(
      map(usercontentsArray =>
        usercontentsArray.map(u =>
          this.dataConverter.mapUserContentToContentInterface(u)
        )
      )
    )
  ).pipe(
    map(arrays => Array.prototype.concat.apply([], arrays)) //flatten arrays
  );

  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  constructor(private dataConverter: DataConverterService) {}

  private getMockBundle(): Observable<BundleInterface> {
    const bundle = {
      icon: 'icon-tasks',
      name: 'Algemeen',
      description: 'Dit is een subtitel',
      start: new Date('2018-09-01 00:00:00'),
      end: new Date('2018-09-01 00:00:00'),
      learningArea: {
        name: 'Aardrijkskunde',
        icon: 'icon-aardrijkskunde',
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

  private getMockEducontents(): Observable<EduContentInterface[]> {
    const eduContent = {
      type: 'boek-e',
      id: 1,
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
        ],
        eduContentProductType: {
          name: 'aardrijkskunde',
          icon: 'icon-aardrijkskunde'
        }
      }
    };
    return of([eduContent, eduContent]);
  }

  private getMockUsercontents(): Observable<UserContentInterface[]> {
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
    return of([userContent, userContent]);
  }
}
