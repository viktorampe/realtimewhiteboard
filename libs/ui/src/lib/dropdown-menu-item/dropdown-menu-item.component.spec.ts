import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownMenuItemComponent } from './dropdown-menu-item.component';

const mockData = {
  title: 'foo',
  link: 'link',
  alt: 'alt',
  image: '/image.png',
  icon: 'icon-brol'
};

describe('DropdownMenuItemComponent', () => {
  let component: DropdownMenuItemComponent;
  let fixture: ComponentFixture<DropdownMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownMenuItemComponent]
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
    expect(element).toBe(null);
  });

  it('should have the correct link', () => {
    component.link = mockData.link;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item a')
    );
    expect(element.nativeElement.href).toContain(mockData.link);
  });

  it('should have the correct img alt', () => {
    component.image = mockData.image;
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item img')
    );
    expect(element.nativeElement.alt).toBe(mockData.alt);
  });

  it('should show the correct img', () => {
    component.image = mockData.image;
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item img')
    );
    expect(element.nativeElement.src).toContain(mockData.image);
  });

  it('should not show an image if none is set', () => {
    component.image = '';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item img')
    );
    expect(element).toBe(null);
  });

  it('should not show an image if none is set', () => {
    component.image = '';
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item img')
    );
    expect(element).toBe(null);
  });

  it('should not show an image if an icon is set', () => {
    component.image = mockData.image;
    component.icon = mockData.icon;
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item img')
    );
    expect(element).toBe(null);
  });

  it('should not show an icon if an image is set', () => {
    component.image = mockData.image;
    component.icon = mockData.icon;
    component.imageAltText = mockData.alt;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item i')
    );
    expect(element).toBe(null);
  });

  it('should show an icon if icon is set', () => {
    component.icon = mockData.icon;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item i')
    );
    expect(element).toBeTruthy();
  });

  it('should show the correct icon', () => {
    component.icon = mockData.icon;
    fixture.detectChanges();
    const element = fixture.debugElement.query(
      By.css('.ui-dropdown-menu-item i')
    );
    expect(element.nativeElement.className).toBe(mockData.icon);
  });
});
