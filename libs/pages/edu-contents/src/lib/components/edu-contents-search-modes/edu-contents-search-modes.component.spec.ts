import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { EduContentSearchModesComponent } from './edu-contents-search-modes.component';

describe('EduContentSearchModesComponent', () => {
  let component: EduContentSearchModesComponent;
  let fixture: ComponentFixture<EduContentSearchModesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [EduContentSearchModesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
