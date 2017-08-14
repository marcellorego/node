import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { ApiDataService } from '../api/api.data.service';
import { IProfile } from '../model/profile.interface';

@Component({
  selector: 'app-view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  selectedItems: any[];
  private rowData: any[];
  @ViewChild('homeGrid') homeGrid: DataTable;

  constructor(private dataService: ApiDataService) {
    // Do stuff
    this.getRowData();
  }

  ngOnInit() {
    console.log('Hello Home');
  }

  ngAfterViewInit() {
    const dt: DataTable = this.homeGrid as DataTable;
    console.log(dt.el);
  }

  private getRowData() {
    const rowData: any[] = [];
    this.dataService.getResource('profile').subscribe(data => {
      this.rowData = <IProfile[]>data;
    });
  }

}
