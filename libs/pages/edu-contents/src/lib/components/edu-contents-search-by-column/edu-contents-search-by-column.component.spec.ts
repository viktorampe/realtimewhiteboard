import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { EduContentSearchByColumnComponent } from './edu-contents-search-by-column.component';

describe('EduContentSearchByColumnComponent', () => {
  let component: EduContentSearchByColumnComponent;
  let fixture: ComponentFixture<EduContentSearchByColumnComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [EduContentSearchByColumnComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchByColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
