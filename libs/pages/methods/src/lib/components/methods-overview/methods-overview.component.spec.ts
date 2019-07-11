import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MethodsOverviewComponent } from './methods-overview.component';

describe('MethodsOverviewComponent', () => {
  let component: MethodsOverviewComponent;
  let fixture: ComponentFixture<MethodsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MethodsOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
