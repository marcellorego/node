import { NgModule } from '@angular/core';
import { ApiConfigService } from './api.config.service';
import { ApiDataService } from './api.data.service';

@NgModule({
  imports: [],
  providers: [
    ApiConfigService,
    ApiDataService
  ]
})
export class ApiModule {}
