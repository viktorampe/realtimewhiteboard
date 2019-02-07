import { InjectionToken } from '@angular/core';

export interface FavIconServiceInterface {
  setFavicon(url: string, mimeType: string): void;
  resetFavicon(): void;
}

export const FAVICON_SERVICE_TOKEN = new InjectionToken('FavIconService');

export class FavIconService implements FavIconServiceInterface {
  private faviconId = 'favicons-injected-node';

  constructor() {
    this.removePresetFavicon();
  }

  setFavicon(url: string, mimeType: string): void {
    this.setNode(url, mimeType);
  }

  resetFavicon(): void {
    this.removeNode();
  }

  addNode(url: string, mimeType: string): void {
    const faviconElement = document.createElement('link');
    faviconElement.setAttribute('id', this.faviconId);
    faviconElement.setAttribute('rel', 'icon');
    faviconElement.setAttribute('type', mimeType);
    faviconElement.setAttribute('href', url);
    document.head.appendChild(faviconElement);
  }

  setNode(url: string, mimeType: string): void {
    this.removeNode();
    this.addNode(url, mimeType);
  }

  removeNode(): void {
    const faviconElement = document.head.querySelector('#' + this.faviconId);
    if (faviconElement) {
      document.head.removeChild(faviconElement);
    }
  }

  removePresetFavicon(): void {
    const favicons = document.querySelectorAll("link[ rel ~= 'icon' i]");
    for (const favicon of Array.from(favicons)) {
      favicon.parentNode.removeChild(favicon);
    }
  }
}
