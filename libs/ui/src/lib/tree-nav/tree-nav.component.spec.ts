import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNavComponent } from './tree-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CdkTreeModule } from '@angular/cdk/tree';

describe('TreeNavComponent', () => {
  let component: TreeNavComponent;
  let fixture: ComponentFixture<TreeNavComponent>;

  let tree: HTMLElement;
  let treeNodes: HTMLCollection;

  let mockData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CdkTreeModule],
      declarations: [TreeNavComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNavComponent);
    component = fixture.componentInstance;

    tree = fixture.nativeElement.querySelector('cdk-tree');
    treeNodes = tree.children;

    mockData = {
      nav: [
        {
          title: 'string',
          icon: 'iconClass',
          link: 'route'
        },
        {
          title: 'string',
          icon: 'iconClass',
          children: [
            {
              title: 'string',
              icon: 'iconClass',
              link: 'route',
              children: [
                {
                  title: 'string',
                  icon: 'iconClass',
                  link: 'route'
                }
              ]
            },
            {
              title: 'string',
              icon: 'iconClass',
              link: 'route'
            },
            {
              title: 'string',
              icon: 'iconClass',
              link: 'route'
            }
          ]
        },
        {
          title: 'string',
          link: 'route'
        }
      ]
    };

    component.treeNav = mockData.nav;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show icon on first node', () => {
    const node = treeNodes[0];
    expect(node.querySelector('i:first-child')).toBeTruthy();
  });

  it('should set classname for icon', () => {
    const node = treeNodes[0];
    expect(node.querySelector('i:first-child').className).toBe('iconClass');
  });
  
  it('should not show icon on third node', () => {
    const node = treeNodes[2];
    expect(node.querySelector('i:first-child')).toBeFalsy();
  });

  it('should have children on second node', () => {
    const node = treeNodes[1];
    expect(node.tagName.toLowerCase()).toBe('cdk-nested-tree-node');

    const childNodes = node.querySelector('ul').children;
    expect(childNodes.length).toBe(3);
  });

  it('should have nested children on second node', () => {
    const node = treeNodes[1];
    expect(node.tagName.toLowerCase()).toBe('cdk-nested-tree-node');

    const childNode = node.querySelector('ul').children[0];
    const childNodes = childNode.querySelector('ul').children;
    expect(childNodes.length).toBe(1);
  });

  it('should show toggle icon when node has children', () => {
    const node = treeNodes[1];
    expect(node.querySelector('i.ui-tree-nav__node--toggle')).toBeTruthy();
  });

  it('should not show toggle icon when node has no children', () => {
    const node = treeNodes[0];
    expect(node.querySelector('i.ui-tree-nav__node--toggle')).toBeFalsy();
  });

  it('should add link property as href', () => {
    const node = treeNodes[0];
    expect(node.querySelector('a').getAttribute('href')).toBe('/route');
  });

});
