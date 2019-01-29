import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteNotFoundComponent } from './route-not-found-component';

describe('RouteNotFoundComponent', () => {
  let component: RouteNotFoundComponent;
  let fixture: ComponentFixture<RouteNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouteNotFoundComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RouteNotFoundComponent);
    component = fixture.componentInstance;
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
