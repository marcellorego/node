import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit, OnDestroy {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello SubmenuComponent');
  }

  ngOnDestroy() {
  }
}
