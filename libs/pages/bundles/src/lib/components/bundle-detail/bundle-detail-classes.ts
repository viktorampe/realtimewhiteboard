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
  function: string;

  public constructor(init?: Partial<ContentAction>) {
    Object.assign(this, init);
  }
}
export class Content {
  productType: string;
  fileExtension: string;
  previewImage: string;
  title: string;
  description: string;
  methodLogo: string;
  actions: ContentAction[];
  status: string;

  public constructor(init?: Partial<Content>) {
    Object.assign(this, init);
  }

  transformToContentForInfoPanel(): object {
    const contentForInfoPanel = new ContentForInfoPanel({
      name: this.title,
      description: this.description,
      extention: this.fileExtension,
      productType: this.productType,
      methods: [this.methodLogo],
      status: this.status
    });

    return contentForInfoPanel;
  }
}

export class ContentForInfoPanel {
  preview?: string;
  name: string;
  description: string;
  extention: string;
  productType: string;
  methods: string[];
  status: any;

  public constructor(init?: Partial<ContentForInfoPanel>) {
    Object.assign(this, init);
  }
}
