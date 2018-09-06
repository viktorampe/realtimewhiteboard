import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicAppBarComponent } from './basic-app-bar.component';

describe('BasicAppBarComponent', () => {
  let component: BasicAppBarComponent;
  let fixture: ComponentFixture<BasicAppBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasicAppBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicAppBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
