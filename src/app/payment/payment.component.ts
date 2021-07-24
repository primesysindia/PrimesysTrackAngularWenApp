import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { PaymentDetailsInfo } from '../core/paymentDetailsInfo.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentDetails: MatTableDataSource<PaymentDetailsInfo>;
  tableHeader: Array<string> = ['Device_name', 'IMEI_No', 'Device_SimNo', 'Plan_Type', 'LastPaymentDate', 
                                'ExpiryDate', 'DeviceStatus', 'RemainingDays'];
  showPagination: boolean = true;
  //spinner
  loading:boolean = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private payServ: PaymentService,
              public dialog: MatDialog
              ) {}

  ngOnInit() {
    this.payServ.getPaymentDetails()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((res: Array<PaymentDetailsInfo>) => {
      this.loading = false;
      // console.log(res)
      if(res.length>10){
        this.showPagination = false;
      }
      this.paymentDetails = new MatTableDataSource<PaymentDetailsInfo>(res);
      this.paymentDetails.paginator = this.paginator;
      this.paymentDetails.filterPredicate = function(data, filter: string): boolean {
        return data.FullName.toLowerCase().includes(filter)
      };
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
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.paymentDetails.filter = filterValue;
    
    if (this.paymentDetails.paginator) {
      this.paymentDetails.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
