import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodYearTileComponent } from './method-year-tile.component';

describe('MethodYearTileComponent', () => {
  let component: MethodYearTileComponent;
  let fixture: ComponentFixture<MethodYearTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MethodYearTileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodYearTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
