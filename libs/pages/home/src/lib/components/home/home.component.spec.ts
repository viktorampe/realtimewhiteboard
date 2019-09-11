import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [HomeComponent],
      providers: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
