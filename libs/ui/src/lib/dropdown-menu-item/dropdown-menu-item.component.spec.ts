import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { DropdownMenuItemComponent } from './dropdown-menu-item.component';

const mockData = {
  title: 'foo',
  link: 'link',
  alt: 'alt',
  image: '/image.png',
  icon: 'icon-brol',
  header: 'foobar'
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

  it('should show correct title', () => {
    component.title = mockData.title;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__title')
    );
    expect(element.nativeElement.textContent).toBe(mockData.title);
  });

  it('should not show the title', () => {
    component.title = '';
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__title')
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

  it('should show an header if internal link is set', () => {
    component.header = mockData.header;
    component.internalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__header')
    );
    expect(element).toBeTruthy();
  });

  it('should show an header if external link is set', () => {
    component.header = mockData.header;
    component.externalLink = 'a';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__header')
    );
    expect(element).toBeTruthy();
  });

  it('should not show an header if no link is set', () => {
    component.header = mockData.header;
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item__header')
    );
    expect(element).toBeFalsy();
  });
});
