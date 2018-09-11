import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoPanelEducontentPreviewComponent } from './educontent-preview.component';

describe('InfoPanelEducontentPreviewComponent', () => {
  let component: InfoPanelEducontentPreviewComponent;
  let fixture: ComponentFixture<InfoPanelEducontentPreviewComponent>;

  let mockData: {
    titleText: string;
    description: string;
    productTypeIcon: string;
    fileExtentionIcon: string;
    contentPreview?: string;
    methods?: string[];
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelEducontentPreviewComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelEducontentPreviewComponent);
    component = fixture.componentInstance;

    mockData = {
      titleText: 'the-title',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      productTypeIcon: 'polpo-presentatie',
      fileExtentionIcon: 'ppt',
    }

    component.titleText = mockData.titleText;
    component.description = mockData.description;
    component.productTypeIcon = mockData.productTypeIcon;
    component.fileExtentionIcon = mockData.fileExtentionIcon;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the title', () => {
    const title = fixture.debugElement.query(
      By.css('.info-panel__educontent-preview__product__details__title')
    ).nativeElement.textContent;
    expect(title).toBe(mockData.titleText);
  });
  it('should show the description', () => {
    const title = fixture.debugElement.query(
      By.css('.info-panel__educontent-preview__product__details__description')
    ).nativeElement.textContent;
    expect(title).toBe(mockData.description);
  });
  it('should show the productTypeIcon', () => {
    const productTypeIcon = fixture.debugElement.query(
      By.css('.info-panel__educontent-preview__product__details__type-icon')
    );
    expect(productTypeIcon).toBeTruthy();
  });
  it('should show the fileExtentionIcon', () => {
    const fileExtentionIcon = fixture.debugElement.query(
      By.css('.info-panel__educontent-preview__product__file-extention-icon')
    );
    expect(fileExtentionIcon).toBeTruthy();
  });
  it('should not show methods image if no methods were given', () => {
    const method = fixture.debugElement.query(
      By.css('.info-panel__educontent-preview__methods')
    );
    expect(method).toBeFalsy();
  });
  it('should show the methods if these are given', () => {
    component.methods = ['method-one', 'method-two', 'method-three']
    fixture.detectChanges();
    const methods = fixture.debugElement.queryAll(
      By.css('.info-panel__educontent-preview__methods__method')
    );
    expect(methods.length).toBe(3);
  });
  it('should not show contentPreview if none was given', () => {
    const preview = fixture.debugElement.query(
      By.css('.info-panel__educontent-preview__preview')
    );
    expect(preview).toBeFalsy();
  });
  it('should not show contentPreview if none was given', () => {
    component.preview = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    fixture.detectChanges();
    const preview = fixture.debugElement.query(
      By.css('.info-panel__educontent-preview__preview')
    );
    expect(preview).toBeTruthy();
  });
});
