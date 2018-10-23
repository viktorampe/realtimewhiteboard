import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarItemDropdownComponent } from './toolbar-item-dropdown.component';

describe('ToolbarItemDropdownComponent', () => {
  let component: ToolbarItemDropdownComponent;
  let fixture: ComponentFixture<ToolbarItemDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarItemDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarItemDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
