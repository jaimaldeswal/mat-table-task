import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../app.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  allData = [];
  public displayedColumns: string[] = ['name', 'tower_name', 'propertyType', 'configurationName', 'min_price', 'bedroom', 'bathroom', 'halfBathroom'];
  public dataSource: any;
  public uniqueConfiguration: Array<any> = [];

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getAlldata()


  }
  getAlldata() {
    this.appService.getJSON().subscribe((response) => {

      this.allData = response.data;
      this.dataSource = new MatTableDataSource(this.allData)
      this.allData.forEach((element: any) => {
        let isPresent = this.uniqueConfiguration.find((el: any) => Number(el.id) == Number(element.configuration.id))
        if (!isPresent) {
          this.uniqueConfiguration.push({ ...element.configuration, checked: false })
        }
      });


    });
  }
  sortData(event: any) {
    this.dataSource.sort = this.sort;
  }

  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  priceChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue != '') {
      this.dataSource = this.allData.filter((el: any) => Number(el.min_price) > Number(filterValue))
    } else {
      this.dataSource = new MatTableDataSource(this.allData)
    }
  }
  configChange(event: Event) {


    const allConfig: any = [];
    setTimeout(() => {
      this.uniqueConfiguration.forEach(el => {

        if (el.checked == true) {

          allConfig.push(el.name);
        }
      })
      if (allConfig.length > 0) {
        this.dataSource = this.allData.filter((el: any) => allConfig.includes(el.configuration.name))

      } else {
        this.dataSource = new MatTableDataSource(this.allData)
      }
    }, 1)



  }



}
