import { Component, OnInit, OnDestroy, ViewContainerRef,
  Compiler, ComponentFactory, ComponentFactoryResolver,
  ModuleWithComponentFactories, ComponentRef, ReflectiveInjector,
  SystemJsNgModuleLoader } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-view-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {

  // paramsSub: ISubscription;
  dataSub: ISubscription;
  cmpRef: ComponentRef<any>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private loader: SystemJsNgModuleLoader,
    private compiler: Compiler,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('Loader created');

    // this.paramsSub = this.route.queryParams.subscribe(queryParams => {
    //   component = queryParams['component'];
    //   modulePath = queryParams['modulePath'];
    //   console.log(queryParams);
    //   // In a real app: dispatch action to load the details here.
    //   this.module = new ModuleReference();
    //   this.module.modulePath = modulePath;
    //   this.module.componentName = component;
    //   this.openWebModule(this.module);
    // });

    this.dataSub = this.route.data.subscribe(data => {
      const component: string = data['componentName'];
      const modulePath: string = data['modulePath'];
      console.log(data);
      // In a real app: dispatch action to load the details here.
      if (component && modulePath) {
        this.openWebModule(data);
      }
    });
  }

  ngOnDestroy() {
    // if (this.paramsSub) {
    //   this.paramsSub.unsubscribe();
    // }
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    if (this.cmpRef) {
        this.cmpRef.destroy();
    }
  }

  openWebModule(data: any) {
      this.loader.load(data.modulePath)  // load the module and its components
          .then((modFac) => {
              // the missing step, need to use Compiler to resolve the module's embedded components
              this.compiler.compileModuleAndAllComponentsAsync<any>(modFac.moduleType)
                  .then((factory: ModuleWithComponentFactories<any>) => {
                      return factory.componentFactories.find(x => x.componentType.name === data.componentName);
                  })
                  .then(cmpFactory => {
                      // need to instantiate the Module so we can use it as the provider for the new component
                      const modRef = modFac.create(this.viewContainerRef.injector);
                      this.cmpRef = this.viewContainerRef.createComponent(cmpFactory, 0, modRef.injector);
                      Object.assign(this.cmpRef.instance, data);
                      // done, now Module and main Component are known to NG2
                  })
                  ;
          });
  }
}
