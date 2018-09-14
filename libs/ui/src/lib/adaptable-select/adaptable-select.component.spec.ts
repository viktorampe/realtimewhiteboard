import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdaptableSelectComponent } from './adaptable-select.component';


describe('AdaptableSelectComponent', () => {
  let component: AdaptableSelectComponent;
  let fixture: ComponentFixture<AdaptableSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptableSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the dropdown options', () => {

  });
});
