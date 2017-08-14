import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Car } from '../model/car.model';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit, AfterViewInit {
  cars: Car[];
  cols: any[];
  selectedItems: any[];
  title: string;

  @ViewChild(DataTable) carsTable: DataTable;

  constructor() { }

  ngOnInit() {
    console.log('Hello CrudComponent');
    this.cars = [
      new Car(1, 'VW', 'Passat', 2012, 'ff0000'),
      new Car(2, 'Audi', 'A3',  2011, '000000'),
      new Car(3, 'BMW', '318i',  2012, '0000ff')
    ];

    this.cols = [
            {field: 'model', header: 'Model',
              sortable: true, filter: true,
              filterMatchMode: 'contains', allowToggle: true, style: { 'width': 'auto', 'vertical-align': 'top' } },
            {field: 'year', header: 'Year',
              sortable: true, filter: true,
              filterMatchMode: 'startsWith', allowToggle: true, style: { 'width': '80px', 'vertical-align': 'top' }},
            {field: 'brand', header: 'Brand'},
            {field: 'color', header: 'Color'}
    ];
  }

  ngAfterViewInit() {
    const dt: DataTable = this.carsTable as DataTable;
    console.log(dt.el);
  }

  onRowSelect(event: any) {
    console.log(event.data);
  }

  onRowUnselect(event: any) {
    console.log(event.data);
  }

  onPageChange(event: any) {
    console.log(event);
  }
}
