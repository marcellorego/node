import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';

import {
Compiler,
ComponentFactory,
ComponentFactoryResolver,
ModuleWithComponentFactories,
ComponentRef,
ReflectiveInjector,
SystemJsNgModuleLoader } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private viewContainerRef: ViewContainerRef) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }
  ngOnInit() {
    console.log('AppComponent loaded.');
  }

  ngOnDestroy() {
     console.log('AppComponent unloaded.');
  }
}
