import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Amplify from 'aws-amplify';
// import API from '@aws-amplify/api';
// import PubSub from '@aws-amplify/pubsub';
import { AppModule } from './app/app.module';
import awsconfig from './aws-exports';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

// API.configure(awsconfig);
// PubSub.configure(awsconfig);

Amplify.configure(awsconfig);
