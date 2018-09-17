import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;

  let mockData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemComponent);
    component = fixture.componentInstance;

    mockData = {
      folder: {
        Id: 1,
        Name: 'name'
      },
      isGrid: true
    };

    component.folder = mockData.folder;
    component.isGridElement = mockData.isGrid;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
