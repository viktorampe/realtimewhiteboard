import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { DropdownMenuItemComponent } from './dropdown-menu-item.component';

const mockData = {
  header: 'foo',
  link: 'link',
  alt: 'alt',
  image: '/image.png',
  icon: 'icon-brol',
  description: 'foobar'
};

describe('DropdownMenuItemComponent', () => {
  let component: DropdownMenuItemComponent;
  let fixture: ComponentFixture<DropdownMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownMenuItemComponent],
      imports: [MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct header', () => {
    component.header = mockData.header;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__header')
    );
    expect(element.nativeElement.textContent).toBe(mockData.header);
  });

  it('should not show the header if the string is empty', () => {
    component.header = '';
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__header')
    );
    expect(element).toBeFalsy();
  });

  it('should have the correct link external', () => {
    component.externalLink = mockData.link;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item a')
    );
    expect(element.nativeElement.href).toContain(mockData.link);
  });

  it('should not show an image if none is set', () => {
    component.image = '';
    component.externalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('img'));
    expect(element).toBeFalsy();
  });

  it('should show an image if set', () => {
    component.image = 'a';
    component.externalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('img'));
    expect(element).toBeTruthy();
  });

  it('should not show an icon if none set', () => {
    component.icon = '';
    component.externalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('mat-icon'));
    expect(element).toBeFalsy();
  });

  it('should show an icon if set', () => {
    component.icon = 'a';
    component.externalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('mat-icon'));
    expect(element).toBeTruthy();
  });

  it('should show an description if internal link is set', () => {
    component.description = mockData.description;
    component.internalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__description')
    );
    expect(element).toBeTruthy();
  });

  it('should show an description if external link is set', () => {
    component.description = mockData.description;
    component.externalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__description')
    );
    expect(element).toBeTruthy();
  });

  it('should not show an description if no link is set', () => {
    component.description = mockData.description;
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__description')
    );
    expect(element).toBeFalsy();
  });

  it('should show neither icon nor image when both are set', () => {
    component.icon = mockData.icon;
    component.image = mockData.image;
    component.externalLink = mockData.link;
    fixture.detectChanges();
    let element = fixture.debugElement.query(By.css('img'));
    expect(element).toBeFalsy();
    element = fixture.debugElement.query(By.css('mat-icon'));
    expect(element).toBeFalsy();
  });

  it('should correct description', () => {
    component.externalLink = mockData.link;
    component.description = mockData.description;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__description')
    );
    expect(element.nativeElement.textContent).toBe(mockData.description);
  });

  it('should correct image alt', () => {
    component.image = mockData.image;
    component.externalLink = mockData.link;
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('img'));
    expect(element.nativeElement.alt).toBe(mockData.alt);
  });
});
