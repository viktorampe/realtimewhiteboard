import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'; //polyfill
import 'zone.js'; //polyfill
import { ElementModule } from './element.module';

enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(ElementModule)
  .catch(err => console.error(err));
