import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../core/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { ModuleList } from '../core/moduleList.model';
import { ModuleListService } from '../services/module-list.service';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { LiveLocationService } from '../services/live-location.service';
import { FeatureAddress } from '../core/featureAddress.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  //spinner
  public loading:boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  loggedUser: User;
  loginForm: FormGroup;
  errMsg: string;
  hide:boolean = true;
  db:any;
  returnUrl: string;
  railwayUser: boolean = false;

  constructor(private router: Router,
              private loginServ: LoginService,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private modList:ModuleListService,
              public dialog: MatDialog,
              public liveLoc: LiveLocationService,
              private route: ActivatedRoute){}

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    if(this.loginServ.isLoggedIn){
      this.router.navigateByUrl(this.returnUrl)
    }
  }

  get f() { return this.loginForm.controls; }

  login() : void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
  
    this.loginServ.getUserDetails(this.f.username.value.trim(), this.f.password.value.trim())
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data) => {
      if(data.error) {
        this.errMsg= data.message;
      } else {
        this.loading = true;
        this.loggedUser = data;
        localStorage.setItem('currentUserInfo',JSON.stringify(this.loggedUser));
        this.loginServ.apiServerUrl = this.loggedUser.socketUrl;
        this.loginServ.setLoggedIn(true);
        // login successful so redirect to return url
       this.router.navigateByUrl(this.returnUrl);
        // this.fetchReportList();
        // if(data.accSqliteEnable == 0){
        //   this.railwayUser = true;  
        //   //check if using chrome browser
        //   let isChrome;
        //   let browserName;
        //   if ((isChrome = navigator.userAgent.indexOf("Chrome"))!=-1) {
        //       browserName = "Chrome";
        //       localStorage.setItem('browserName',browserName);
        //       //call service to get feature address
        //       this.liveLoc.getFeatureAddress()
        //         .takeUntil(this.ngUnsubscribe)
        //         .subscribe((res: Array<FeatureAddress>) => {
        //         //console.log(res)
        //         this.loginServ.setLoggedIn(true);
        //         this.loading = false;
        //         if(res.length > 0){
        //           localStorage.setItem('featureAdrsAvailable', 'true');
        //             let featureData:Array<any> = [];
        //             res.map(data =>{
        //               data.featureAddressDetail.map(result =>{
        //               result.feature_image = result.feature_image.replace('~','');
        //               featureData.push(result)
        //               })
        //             })
        //             this.fetchReportList()
        //             //console.log(featureData)
        //             this.db = (<any>window).openDatabase('RDPS', '', 'RDPS data', 2 * 1024 * 1024)
        //             this.db.transaction((txSync)=> {
        //               try{
        //                 txSync.executeSql("CREATE TABLE RDPSTable (blockSection VARCHAR(50), distance VARCHAR(50), featureCode VARCHAR(50), featureDetail VARCHAR(50), feature_image VARCHAR(50), kiloMeter VARCHAR(50), latitude VARCHAR(50), longitude VARCHAR(50), section VARCHAR(50))", 
        //                           [], function(sqlTransaction, sqlResultSet) 
        //                 {
        //                   //console.log("Table has been created.");
        //                 });
        //               }
        //               catch(sqlException){
        //                 console.log('An error occured while creating a table'+sqlException);
        //               }
        //               if(featureData){
        //                 featureData.forEach((data)=> {
        //                   try{
        //                     txSync.executeSql("INSERT INTO RDPSTable(blockSection, distance, featureCode, featureDetail, feature_image, kiloMeter, latitude, longitude, section) VALUES (?,?,?,?,?,?,?,?,?)",
        //                     [data.blockSection, data.distance, data.featureCode, data.featureDetail, data.feature_image, data.kiloMeter, data.latitude, data.longitude, data.section],
        //                     (sqlTransaction, sqlResultSet) => {
        //                       //console.log(sqlResultSet.insertId+'record inserted')
        //                     })
        //                   }
        //                   catch(sqlException){
        //                     console.log('An error occured while inserting records'+sqlException);
        //                   }
        //                 })
        //               }  
        //             }); 
        //         }
        //         else
        //           this.fetchReportList()
        //       },
        //       (error: any) =>{
        //         const dialogConfig = new MatDialogConfig();
        //         //pass data to dialog
        //         dialogConfig.data = {
        //           hint: 'ServerError'
        //         };
        //         const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        //       })
        //   } 
        //   else {
        //   this.loginServ.setLoggedIn(true);
        //   this.fetchReportList()
        //   }
        // }
        // else{
        //   this.loginServ.setLoggedIn(true);
        //   this.fetchReportList()
        // }
      }
    },
    (error: any) => { 
      console.log(error)
      this.openSnackBar('Network Error','Please check your internet connection')
    })
  } //login method ends

//   fetchReportList(){
//      //call to moduleList service for reports list
//      this.modList.getUserModuleList()
//       .takeUntil(this.ngUnsubscribe)
//       .subscribe((res:Array<ModuleList>) => {
//       localStorage.setItem('moduleList',JSON.stringify(res))
//        // login successful so redirect to return url
//       this.router.navigateByUrl(this.returnUrl);
//     },
//     (error: any) =>{
//       const dialogConfig = new MatDialogConfig();
//       //pass data to dialog
//       dialogConfig.data = {
//         hint: 'ServerError'
//       };
//       const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
//     }
// )
//   }

  openSnackBar(message: string, action: string){
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
