import { ContentStatusInterface } from '@campus/dal';

export class Bundle {
  icon: string;
  name: string;
  description: string;
  teacher: Teacher;

  public constructor(init?: Partial<Bundle>) {
    Object.assign(this, init);
  }
}

export class Teacher {
  displayName: string;
  avatar: string;
  name?: string;
  firstName?: string;

  public constructor(init?: Partial<Teacher>) {
    Object.assign(this, init);
  }
}
export class ContentAction {
  text: string;
  icon: string;
  eventHandler: string;

  public constructor(init?: Partial<ContentAction>) {
    Object.assign(this, init);
  }
}

export class ContentForInfoPanel {
  preview?: string;
  name: string;
  description: string;
  extension: string;
  productType: string;
  methods: string[];
  status: ContentStatusInterface;

  public constructor(init?: Partial<ContentForInfoPanel>) {
    Object.assign(this, init);
  }
}

export class ContentsForInfoPanel {
  text: string;
  count?: number;
  editable?: boolean;
  data?: any;

  public constructor(init?: Partial<ContentsForInfoPanel>) {
    Object.assign(this, init);
  }
}

export class Content {
  productType: string;
  fileExtension: string;
  previewImage: string;
  name: string;
  description: string;
  methodLogo: string;
  actions: ContentAction[];
  status: ContentStatusInterface;

  public constructor(init?: Partial<Content>) {
    Object.assign(this, init);
  }

  transformToContentForInfoPanel(): object {
    const contentForInfoPanel = new ContentForInfoPanel({
      name: this.name,
      description: this.description,
      extension: this.fileExtension,
      productType: this.productType,
      methods: [this.methodLogo],
      status: this.status
    });

    return contentForInfoPanel;
  }

  transformToContentsForInfoPanel(): object {
    const contentsForInfoPanel = new ContentsForInfoPanel({
      text: this.name,
      data: this
    });

    return contentsForInfoPanel;
  }
}
