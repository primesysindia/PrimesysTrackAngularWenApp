import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { IssueLoggingService } from '../services/issue-logging.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { IssueList} from '../core/issueInfo.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-issue-history',
  templateUrl: './issue-history.component.html',
  styleUrls: ['./issue-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IssueHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  dataSource: MatTableDataSource<IssueList>;
  loading: boolean = false;
  data:any;
  issueData: any;
  tableHeader: Array<string> = ['issueTicketId', 'divisionName', 'deviceName', 'issueTitle', 'contactPerson', 'contactPersonMobNo' ];
  
  constructor(
    public dialog: MatDialog,
    private issueService: IssueLoggingService) { }

  ngOnInit() {
    this.getIssueDetails();
  }

  getIssueDetails() {
    this.loading = true;
    this.issueService.getAllIssueHistory().subscribe((res: Array<IssueList>)=> {
      this.loading = false;
      if(res.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'issueHistoryNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.data = res;
        this.issueData = new MatTableDataSource<IssueList>(this.data);
        this.dataSource = this.issueData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    },(err) => {
      this.loading = false;
        const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'ServerError'
            };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    })
  }
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  

}
