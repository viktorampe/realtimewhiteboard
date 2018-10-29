import { CdkTreeModule } from '@angular/cdk/tree';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavItem, TreeNavComponent } from './tree-nav.component';

xdescribe('TreeNavComponent', () => {
  let component: TreeNavComponent;
  let fixture: ComponentFixture<TreeNavComponent>;

  let tree: HTMLElement;
  let treeNodes: HTMLCollection;

  let mockData: {
    nav: NavItem[];
  };

  const createNode = (children?: NavItem[], icon?: boolean, link?: boolean) => {
    const node: NavItem = {
      title: 'title'
    };
    if (icon !== false) {
      node.icon = 'iconClass';
    }
    if (link !== false) {
      node.link = 'route';
    }
    if (children) {
      node.children = children;
    }
    return node;
  };

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
        createNode(),
        createNode([createNode([createNode()]), createNode(), createNode()]),
        createNode(null, false),
        createNode(null, true, false)
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

  it('should have three children on second node', () => {
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

  it('should show arrow icon when node has children', () => {
    const node = treeNodes[1];
    expect(node.querySelector('i.ui-tree-nav__node__arrow')).toBeTruthy();
  });

  it('should not show arrow icon when node has no children', () => {
    const node = treeNodes[0];
    expect(node.querySelector('i.ui-tree-nav__node__arrow')).toBeFalsy();
  });

  it('should add link property as href', () => {
    const node = treeNodes[0];
    expect(node.querySelector('a').getAttribute('href')).toBe('/route');
  });

  it('should set href property to current url when no link is set', () => {
    const node = treeNodes[3];
    expect(node.querySelector('a').getAttribute('href')).toBe('/');
  });

  it('should open the second node', () => {
    // check if default state is closed
    const node = treeNodes[1].children[0];
    expect(node.className).toContain('ui-tree-nav__node--closed');

    // expand node
    const newNav = mockData.nav.slice();
    newNav[1].expanded = true;
    // apply updated nav
    component.treeNav = newNav;
    fixture.detectChanges();
    expect(node.className).not.toContain('ui-tree-nav__node--closed');
  });

  // no tests for click handler because that is triggered through the "cdkTreeNodeToggle" Angular Material directive
});
