import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular13Crud';

  displayedColumns: string[] = ['productName', 'category', 'freshness', 'price','comment','date','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,public api:ApiService){}

  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: null,
    }).afterClosed().subscribe((res) => {
      if(res === "save"){this.getAllProducts();}
    });
  }

  
  getAllProducts(){
    this.api.getProduct()
    .subscribe(
      (res) => 
      {
        this.dataSource = new MatTableDataSource(res); 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
         console.log(res);
      },
      (err) => {}
    )
  }

  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width: '30%',
      data: row
    }).afterClosed().subscribe((res) => {
      if(res ==="update"){this.getAllProducts();}
    })
  }

  deleteProduct(id:number){

    if(confirm("Are you sure..?")){
    this.api.deleteProduct(id)
    .subscribe(
      (res)=> {alert("Product deleted successfully..!!"); this.getAllProducts();},
      (err) => {alert("Product delete failed..!!");}
      )
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
