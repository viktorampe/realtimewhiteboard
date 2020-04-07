import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import {
  FileReaderServiceInterface,
  FILEREADER_SERVICE_TOKEN
} from '@campus/browser';
import { hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { CardFixture } from '../../models/card.fixture';
import ImageInterface from '../../models/image.interface';
import { WhiteboardInterface } from '../../models/whiteboard.interface';
import {
  WhiteboardHttpService,
  WhiteboardHttpServiceInterface
} from '../../services/whiteboard-http.service';
import { WhiteboardModule } from '../../whiteboard.module';
import { CardImageUploadInterface } from '../whiteboard/whiteboard.component';
import { WhiteboardStandaloneComponent } from './whiteboard-standalone.component';

describe('WhiteboardStandaloneComponent', () => {
  let component: WhiteboardStandaloneComponent;
  let fixture: ComponentFixture<WhiteboardStandaloneComponent>;
  let whiteboardHttpService: WhiteboardHttpServiceInterface;
  let fileReaderService: FileReaderServiceInterface;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: FILEREADER_SERVICE_TOKEN, useValue: {} },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    }).overrideProvider(FILEREADER_SERVICE_TOKEN, {
      useValue: {
        readAsDataURL: jest.fn(),
        loaded$: new BehaviorSubject<string>(null),
        progress$: new BehaviorSubject<number>(null)
      }
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
    fixture = TestBed.createComponent(WhiteboardStandaloneComponent);
    component = fixture.componentInstance;
    whiteboardHttpService = TestBed.get(WhiteboardHttpService);
    fileReaderService = TestBed.get(FILEREADER_SERVICE_TOKEN);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('whiteboard$', () => {
    beforeEach(() => {
      jest.spyOn(whiteboardHttpService, 'getJson').mockReturnValue(
        of({
          title: 'this is the result of the service.getJson()'
        } as WhiteboardInterface)
      );
    });

    it('should use the data input as source stream when canManage = false and data != null', () => {
      component.eduContentMetadataId = 666; // this input should not be used
      component.apiBase = 'www.api.foo.com'; // this input should not be used
      component.canManage = false;
      component.whiteboardData = {
        title: 'whiteboard title'
      } as WhiteboardInterface;

      component.ngOnInit();

      expect(component.title$).toBeObservable(
        hot('(a|)', { a: 'whiteboard title' })
      );

      expect(whiteboardHttpService.getJson).not.toHaveBeenCalled();
    });

    it('should use service.getJson() as source stream when canManage = false and data = null', () => {
      component.canManage = false;
      component.whiteboardData = null;

      component.ngOnInit();

      expect(whiteboardHttpService.getJson).toHaveBeenCalled();
      expect(component.title$).toBeObservable(
        hot('(a|)', { a: 'this is the result of the service.getJson()' })
      );
    });

    it('should use service.getJson() as source stream when canManage = true', () => {
      component.eduContentMetadataId = 666;
      component.canManage = true;
      component.whiteboardData = {
        title: 'whiteboard title'
      } as WhiteboardInterface; // this input should not be used

      component.ngOnInit();

      expect(whiteboardHttpService.getJson).toHaveBeenCalled();
      expect(component.title$).toBeObservable(
        hot('(a|)', { a: 'this is the result of the service.getJson()' })
      );
    });
  });

  describe('presentation streams', () => {
    const pathToImage = '/relative/path/to/image';
    const mockApiBase = 'www.api.foo.com';

    const mockCards = [
      new CardFixture({ id: '1' }),
      new CardFixture({ id: '2' })
    ];
    const mockShelfCards = [
      new CardFixture({ id: '3', image: { imageUrl: pathToImage } }),
      new CardFixture({ id: '4', image: null })
    ];

    beforeEach(() => {
      jest.spyOn(whiteboardHttpService, 'getJson').mockReturnValue(
        of({
          title: 'foo title',
          cards: mockCards,
          shelfCards: mockShelfCards,
          defaultColor: 'foo color'
        })
      );

      component.eduContentMetadataId = 666;
      component.apiBase = mockApiBase;

      component.ngOnInit();
    });

    it('title$ should emit the title of the whiteboard', () => {
      expect(component.title$).toBeObservable(hot('(a|)', { a: 'foo title' }));
    });

    it('cards$ should always emit an empty array', () => {
      expect(component.cards$).toBeObservable(hot('(a|)', { a: [] }));
    });

    it('shelfCards$ should emit an array containing shelf cards', () => {
      expect(component.shelfCards$).toBeObservable(
        hot('(a|)', {
          a: [
            new CardFixture({
              id: '3',
              mode: 2,
              image: { imageUrl: `${mockApiBase}${pathToImage}` }
            }),
            new CardFixture({ id: '4', mode: 2, image: null })
          ]
        })
      );
    });

    it('defaultColor$ should emit the default color of the whiteboard', () => {
      expect(component.defaultColor$).toBeObservable(
        hot('(a|)', { a: 'foo color' })
      );
    });
  });

  describe('saveWhiteboard()', () => {
    beforeEach(() => {
      jest.spyOn(whiteboardHttpService, 'setJson').mockReturnValue(of());
    });
    it('should not save if canManage = false', () => {
      component.canManage = false;
      component.ngOnInit();

      component.saveWhiteboard({} as WhiteboardInterface);

      expect(whiteboardHttpService.setJson).not.toHaveBeenCalled();
    });

    it('should save if canManage = true', () => {
      component.canManage = true;
      component.ngOnInit();

      component.saveWhiteboard({
        title: 'foo',
        shelfCards: []
      } as WhiteboardInterface);

      expect(whiteboardHttpService.setJson).toHaveBeenCalledTimes(1);
      expect(whiteboardHttpService.setJson).toHaveBeenCalledWith({
        title: 'foo',
        shelfCards: []
      });
    });

    it('should remove workspace cards before saving', () => {
      component.canManage = true;
      component.ngOnInit();

      component.saveWhiteboard({
        cards: [new CardFixture()],
        shelfCards: [new CardFixture({ image: null })]
      } as WhiteboardInterface);

      expect(whiteboardHttpService.setJson).toHaveBeenCalledTimes(1);
      expect(whiteboardHttpService.setJson).toHaveBeenCalledWith({
        shelfCards: [new CardFixture({ image: null })]
      });
    });

    it('should remove the apiBase from imageUrls before saving', () => {
      const mockApibase = 'www.api.foo.com';
      const pathToImage = '/relative/path/to/image';

      component.canManage = true;
      component.apiBase = mockApibase;

      component.ngOnInit();

      component.saveWhiteboard({
        shelfCards: [
          new CardFixture({
            image: { imageUrl: `${mockApibase}${pathToImage}` }
          })
        ]
      } as WhiteboardInterface);

      expect(whiteboardHttpService.setJson).toHaveBeenCalledTimes(1);
      expect(whiteboardHttpService.setJson).toHaveBeenCalledWith({
        shelfCards: [new CardFixture({ image: { imageUrl: pathToImage } })]
      });
    });
  });

  describe('uploadImageForCard()', () => {
    const mockUploadResponse: ImageInterface = {
      progress: 100,
      imageUrl: 'www.urltoimage.com'
    };

    const mockImageToUpload: CardImageUploadInterface = {
      card: new CardFixture(),
      imageFile: {} as File
    };
    describe('canManage = true', () => {
      beforeEach(() => {
        jest
          .spyOn(whiteboardHttpService, 'uploadFile')
          .mockReturnValue(of(mockUploadResponse));
        jest.spyOn(component.imageUploadResponse$, 'next');

        component.canManage = true;
        component.ngOnInit();

        component.uploadImageForCard(mockImageToUpload);
      });

      it('should call httpService.uploadFile()', () => {
        expect(whiteboardHttpService.uploadFile).toHaveBeenCalledTimes(1);
        expect(whiteboardHttpService.uploadFile).toHaveBeenCalledWith(
          mockImageToUpload.imageFile
        );
      });

      it('should use the uploadImageResponse stream to emit the upload response ', () => {
        expect(component.imageUploadResponse$.next).toHaveBeenCalledTimes(1);
        expect(component.imageUploadResponse$.next).toHaveBeenCalledWith({
          card: mockImageToUpload.card,
          image: mockUploadResponse
        });
      });
    });

    describe('canManage = false', () => {
      let progress$: BehaviorSubject<number>;
      let loaded$: BehaviorSubject<string>;
      let spy: jest.SpyInstance;

      beforeEach(() => {
        jest.spyOn(whiteboardHttpService, 'uploadFile');
        spy = jest.spyOn(component.imageUploadResponse$, 'next');

        progress$ = fileReaderService.progress$ as BehaviorSubject<number>;
        loaded$ = fileReaderService.loaded$ as BehaviorSubject<string>;

        component.canManage = false;
        component.ngOnInit();

        component.uploadImageForCard(mockImageToUpload);
      });

      it('should call fileReaderService.readAsDataUrl()', () => {
        expect(fileReaderService.readAsDataURL).toHaveBeenCalledTimes(1);
        expect(fileReaderService.readAsDataURL).toHaveBeenCalledWith(
          mockImageToUpload.imageFile
        );
      });

      it('the uploadImageResponse stream to emit the file read response', () => {
        progress$.next(10);
        progress$.next(100);
        loaded$.next('www.urltoimage.com');

        expect(component.imageUploadResponse$.next).toHaveBeenCalledTimes(3);

        expect(spy).toHaveBeenNthCalledWith(1, {
          card: mockImageToUpload.card,
          image: { progress: 10 }
        });
        expect(spy).toHaveBeenNthCalledWith(2, {
          card: mockImageToUpload.card,
          image: { progress: 100 }
        });
        expect(spy).toHaveBeenNthCalledWith(3, {
          card: mockImageToUpload.card,
          image: mockUploadResponse
        });
      });
    });
  });
});
