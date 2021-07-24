import { Component, OnInit } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { ModuleListService } from '../services/module-list.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import {Router} from '@angular/router';
import { UtilityList } from '../core/moduleList.model';

@Component({
  selector: 'app-utility-module',
  templateUrl: './utility-module.component.html',
  styleUrls: ['./utility-module.component.css']
})
export class UtilityModuleComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public loading:boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  utlilityList: any;
  utilityForm:FormGroup;
  utilityName: any;
  
  constructor(private modList:ModuleListService,
    public dialog: MatDialog,
    private fb: FormBuilder,private router: Router) { }

  ngOnInit() {
    this.utilityForm = this.fb.group({
      utilityType: ['', Validators.required],
    })
    this.loading = true;
    //call to moduleList service for reports list
    this.modList.getUtilityList()
     .takeUntil(this.ngUnsubscribe)
     .subscribe((res: Array<UtilityList>) => {
       if(res.length == 0) {
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoModuleFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
       } else {
          this.loading = false;
          this.utlilityList = res;
          // console.log(this.utlilityList)
       }
   },
   (error: any) =>{
    this.loading = false;
     const dialogConfig = new MatDialogConfig();
     //pass data to dialog
     dialogConfig.data = {
       hint: 'ServerError'
     };
     const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
   })
  }

  get f() { return this.utilityForm.controls; }

  onConfirm() {
    this.utilityName = this.f.utilityType.value.utility;
    switch(this.f.utilityType.value.utility){
    case 'AllKeymanBeat': {
      this.router.navigate(['/keymen-beats']);
      break;
    }
    case 'AllPatrolmanSingleBeat': {
      this.router.navigate(['/all-keymen-beats']);
      break;
    } 
    case 'BeatWisePatrolMan': {
      this.router.navigate(['/all-patrolmen-beat']);
      break;
    }
    default: {
      const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoModuleFound'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      break;
    }
  }
  }
}
 