import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { BeatServicesService } from '../../services/beat-services.service';
import { Subject } from 'rxjs';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patrolmen-confirm-dialog',
  templateUrl: './patrolmen-confirm-dialog.component.html',
  styleUrls: ['./patrolmen-confirm-dialog.component.css']
})
export class PatrolmenConfirmDialogComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading : boolean;

  constructor(public dialogRef: MatDialogRef<PatrolmenConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,  
    public dialog: MatDialog,
    private beatService: BeatServicesService,
    private router: Router) { }


  ngOnInit() {
  }
  onConfirm(): void {
    // Close the dialog, return true
    // console.log(this.data)
    this.loading = true;
   this.beatService.savePatrolmenBeats(this.data).takeUntil(this.ngUnsubscribe)
    .subscribe((data: Message)=>{
      // console.log("data", data)
      if(data.error == "false"){
        this.dialogRef.close();
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'beatAdded'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          this.router.navigate(['/', 'patrolmen-beat-status']);
        }
       else if(data.error == "true"){
        this.dialogRef.close();
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'beatNotAdded'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        else {
          this.dialogRef.close();
          // console.log("data", data)
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'beatNotAdded'
          };
        }
    })
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close('0');
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
