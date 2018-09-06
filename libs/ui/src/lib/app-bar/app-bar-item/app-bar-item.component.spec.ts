import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBarItemComponent } from './app-bar-item.component';

describe('AppBarItemComponent', () => {
  let component: AppBarItemComponent;
  let fixture: ComponentFixture<AppBarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppBarItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
