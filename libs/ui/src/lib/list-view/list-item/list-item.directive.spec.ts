import { ListItemDirective } from './list-item.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('ListItemDirective', () => {
  let component: ListItemDirective;
  let fixture: ComponentFixture<ListItemDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListItemDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
