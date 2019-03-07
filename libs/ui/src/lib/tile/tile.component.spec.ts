import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { TileComponent, TileSecondaryActionInterface } from './tile.component';

describe('TileComponent', () => {
  let component: TileComponent;
  let fixture: ComponentFixture<TileComponent>;
  let mockData: {
    icon: string;
    label: string;
    color: string;
    secondaryActions: TileSecondaryActionInterface[];
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TileComponent],
      imports: [MatIconModule],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileComponent);
    component = fixture.componentInstance;

    mockData = {
      label: 'Wiskunde',
      icon: 'test-icon',
      color: 'blue',
      secondaryActions: [
        {
          label: 'Bekijken',
          icon: 'view-icon',
          onClick: (event: Event) => {}
        }
      ]
    };

    component.label = mockData.label;
    component.icon = mockData.icon;
    component.color = mockData.color;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the content icon if provided', () => {
    expect(
      fixture.debugElement.query(By.css('.ui-tile__content__icon'))
    ).toBeTruthy();
  });

  it('should populate the content label with label text value', () => {});

  it('should change the tile color if color is set', () => {});

  it('should show the secondary actions', () => {});

  it('should show the secondary action icon if provided', () => {});

  it('should not bubble a secondary action click to the main component', () => {});
});
