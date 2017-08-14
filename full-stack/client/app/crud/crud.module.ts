import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud.component';
import { routing } from './crud.routing';

// Import PrimeNG modules
import { DataTableModule } from 'primeng/primeng';

@NgModule({
  imports: [CommonModule, routing, DataTableModule],
  declarations: [CrudComponent]
})
export class CrudModule {}
