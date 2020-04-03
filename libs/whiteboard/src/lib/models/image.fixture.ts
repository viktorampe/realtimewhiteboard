import ImageInterface from './image.interface';

export class ImageFixture implements ImageInterface {
  constructor(props?: Partial<ImageInterface>) {
    return Object.assign(this, props);
  }
}
