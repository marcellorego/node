import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-view-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello About');
  }

  ngOnDestroy() {}

}
