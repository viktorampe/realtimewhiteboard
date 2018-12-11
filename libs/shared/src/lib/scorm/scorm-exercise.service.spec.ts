import { fakeAsync, TestBed } from '@angular/core/testing';
import { WindowService, WINDOW_SERVICE_TOKEN } from '@campus/browser';
import { CurrentExerciseReducer } from '@campus/dal';
import { ScormApiService, SCORM_API_SERVICE_TOKEN } from '@campus/scorm';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { ScormExerciseService } from './scorm-exercise.service';

describe('ScormExerciseService', () => {
  let scormExerciseService: ScormExerciseService;
  let scormApiService: ScormApiService;
  let store: Store<CurrentExerciseReducer.State>;
  let usedState;

  beforeAll(() => {
    usedState = CurrentExerciseReducer.initialState;
    usedState.url = {
      url: 'http://google.com'
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          CurrentExerciseReducer.NAME,
          CurrentExerciseReducer.reducer,
          {
            initialState: usedState
          }
        )
      ],
      providers: [
        ScormExerciseService,
        { provide: SCORM_API_SERVICE_TOKEN, useClass: ScormApiService },
        { provide: WINDOW_SERVICE_TOKEN, useClass: WindowService },
        Store
      ]
    });
    scormExerciseService = TestBed.get(ScormExerciseService);
    scormApiService = TestBed.get(ScormApiService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(scormExerciseService).toBeTruthy();
    expect(scormApiService).toBeTruthy();
    expect(store).toBeTruthy();
  });

  it('should start an preview exercise with answers run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.previewExerciseFromUnlockedContent(13, 13, 13, true);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should start an preview task with answers run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.previewExerciseFromTask(13, 13, 13, true);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should start a preview exercise without answers run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.previewExerciseFromUnlockedContent(13, 13, 13, false);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should start an preview task without answers run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.previewExerciseFromTask(13, 13, 13, false);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should start a exercise as review run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.reviewExerciseFromUnlockedContent(13, 13, 13);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should start a task as review run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.reviewExerciseFromTask(13, 13, 13);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should start a exercise as task run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.startExerciseFromTask(13, 13, 13);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should start a exercise run init and saved to the store', () => {
    const spyScormApiService = jest.spyOn(ScormApiService.prototype, 'init');
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.startExerciseFromUnlockedContent(13, 13, 13);
    expect(spyStore).toHaveBeenCalled();
    expect(spyScormApiService).toHaveBeenCalled();
  });

  it('should close the window and dispatch clear', fakeAsync(() => {
    const spyStore = jest.spyOn(Store.prototype, 'dispatch');
    scormExerciseService.closeExercise();
    expect(spyStore).toHaveBeenCalled();
  }));

  it(
    'currentURL$',
    marbles(m => {
      const currentURL$ = m.hot('--a--b|', {
        a: '',
        b: 'lolcow'
      });

      const result = '--a--b|';
      const result$: Observable<string> = currentURL$;

      m.expect(result$).toBeObservable(result, {
        a: '',
        b: 'lolcow'
      });
    })
  );
});
