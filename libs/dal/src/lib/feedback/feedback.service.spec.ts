import { TestBed } from '@angular/core/testing';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';
import { Store, StoreModule } from '@ngrx/store';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        // ...getStoreModuleForFeatures([EffectFeedbackReducer])
        MatSnackBarModule
      ],
      providers: [
        Store,
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {} }
      ]
    });
  });

  it('should be created', () => {
    const service: FeedbackService = TestBed.get(FeedbackService);
    expect(service).toBeTruthy();
  });
});
