import { async } from '@angular/core/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    //TODO: Fix these imports when the time comes for Kabas
    //Kabas probably needs its own imports in separate modules like polpo
    /*TestBed.configureTestingModule({
      imports: [
        SharedModule,
        UiModule,
        RouterTestingModule,
        NoopAnimationsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        Store,
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: AUTH_SERVICE_TOKEN, useClass: AuthService }
      ],
      declarations: [AppComponent]
    }).compileComponents();*/
  }));

  it('should create the app', () => {
    /*const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();*/
  });
});
