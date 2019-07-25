import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MethodViewModel } from '../method.viewmodel';
import { MockMethodViewModel } from '../method.viewmodel.mock';
import { MethodComponent } from './method.component';

describe('MethodComponent', () => {
  let component: MethodComponent;
  let fixture: ComponentFixture<MethodComponent>;
  let methodViewModel: MethodViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MethodComponent],
      providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
    }).compileComponents();

    methodViewModel = TestBed.get(MethodViewModel);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
