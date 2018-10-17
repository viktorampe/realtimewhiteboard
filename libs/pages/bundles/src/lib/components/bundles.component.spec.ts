import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { BundlesComponent } from './bundles.component';
import { BundlesViewModel } from './bundles.viewmodel';

// TODO fix this test
describe('BundlesComponent', () => {
  let component: BundlesComponent;
  let fixture: ComponentFixture<BundlesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, StoreModule.forRoot({})],
      declarations: [BundlesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BundlesViewModel,
        { provide: ActivatedRoute, value: {} },
        Store
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
