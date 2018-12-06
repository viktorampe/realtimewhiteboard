import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentFixture } from '@campus/dal';
import { InfoPanelContentComponent } from './info-panel-content.component';

describe('InfoPanelContentComponent', () => {
  let component: InfoPanelContentComponent;
  let fixture: ComponentFixture<InfoPanelContentComponent>;

  let mockData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelContentComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelContentComponent);
    component = fixture.componentInstance;

    mockData = {
      content: new ContentFixture({
        name: 'string',
        description: 'string',
        fileExtension: 'string',
        productType: 'string',
        methodLogos: ['string']
      })
    };

    component.content = mockData.content;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
