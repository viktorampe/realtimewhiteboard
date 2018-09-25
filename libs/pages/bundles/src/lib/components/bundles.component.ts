import { Component } from '@angular/core';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent {
  bundle = { name: 'bundle name', description: 'bundle description' };
  teacher = { displayName: 'Tom mertens' };

  eduContent = {
    preview:
      'https://d1fh3heiqa6frl.cloudfront.net/890f054414a06a81489f35e6b27fc23c9ee12d0ce4e0a867801a569a073438de/7bc034592d6ea1a4ec2f3e99eb63ad56_340-1.png',
    name: 'educontent name',
    description: 'educontent description',
    extention: 'ppt',
    productType: 'polpo-presentatie',
    methods: ['opmijkunjerekenen'],
    status: {
      options: ['one', 'two'],
      selectedstatus: 'two'
    }
  };

  eduContentNames = [{ text: 'one' }, { text: 'two' }, { text: 'three' }];

  saveStatus(eventValue: any) {
    console.log(eventValue);
  }
}
