import { Injectable } from '@angular/core';
import {
  BundleInterface,
  ContentInterface,
  EduContent,
  UserContent
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BundleDetailViewModel {
  selectedBundle$: Observable<BundleInterface>;
  bundleContents$: Observable<ContentInterface[]>;
  listFormat$: BehaviorSubject<ListFormat>;

  resolve(): Observable<boolean> {
    this.selectedBundle$ = this.getMockBundle();

    this.bundleContents$ = <Observable<ContentInterface[]>>(
      combineLatest(this.getMockEducontents(), this.getMockUsercontents()).pipe(
        map(arrays => Array.prototype.concat.apply([], arrays))
      )
    );

    this.listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  private getMockBundle(): Observable<BundleInterface> {
    const bundle = <BundleInterface>{
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

  private getMockEducontents(): Observable<ContentInterface[]> {
    const mock = <EduContent>{
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
    const eduContent = Object.assign(new EduContent(), mock);

    return of([eduContent, eduContent]);
  }

  private getMockUsercontents(): Observable<ContentInterface[]> {
    const mock = <UserContent>{
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

    const userContent = Object.assign(new UserContent(), mock);
    return of([userContent, userContent]);
  }
}
