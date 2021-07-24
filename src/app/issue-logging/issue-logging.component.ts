import { Component, OnInit, ViewChild, ElementRef,EventEmitter,Output, AfterViewInit,  OnDestroy  } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HistoryNotFoundComponent } from 'src/app/dialog/history-not-found/history-not-found.component';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';
import { DatePipe } from '@angular/common';
import { Message } from 'src/app/core/message.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Router } from '@angular/router';
import { IssueLoggingService } from '../services/issue-logging.service';
import { DevicesInfo } from '../core/devicesInfo.model';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GetDeviceService } from '../services/get-device.service';
import { LiveLocationService } from '../services/live-location.service';
import { WebsocketService } from '../services/websocket.service';
import { environment } from 'src/environments/environment';
import {MatAccordion} from '@angular/material/expansion';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-issue-logging',
  templateUrl: './issue-logging.component.html',
  styleUrls: ['./issue-logging.component.css']
})
export class IssueLoggingComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public dateTime = new moment();
  

  addIssueForm: FormGroup;
  issue: any;
  showDescription: boolean = false;
  description: any;
  userLoginName: any;
  currUser: any;
  myDate = new Date();
  commandData: any;
  todayDate : Date = new Date();
  loading: boolean;
  student: any;
  imeiNo: any;
  devData: any;
  userId: any;
  devList: Array<DevicesInfo>;
  devicesListss: Array<DevicesInfo>;
  simNo: any;
  beatInfo: any = [];
  data: any;
  showDevDetails: boolean = false;
  devName: any;
  showTable: boolean = false;

  public deviceFilterCtrl: FormControl = new FormControl();
  /** list of devices filtered by search keyword */
  public filteredDevices: ReplaySubject<DevicesInfo[]> = new ReplaySubject<DevicesInfo[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor( private datePipe: DatePipe,
    private fb: FormBuilder, 
    public dialog: MatDialog,
    private router: Router,
    private getDevice: GetDeviceService, 
    private liveLocServ: LiveLocationService,
    private wsServ: WebsocketService,
    private issueService: IssueLoggingService) { }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.userLoginName = this.currUser.userName;
    this.userId = this.currUser.usrId;
    this.initIoConnection();
    
    this.getDevices(this.userId);
    this.getIssueList();

    this.addIssueForm = this.fb.group({
      'issue': ['', Validators.required],
      'caller_name': ['', Validators.required],
      'contact': ['', Validators.required],
      'description': ['', Validators.required],
    })
  }

  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
  }

  getIssueList() {
    this.issueService.GetIssueList()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any)=> {
      if(data.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'IssuelistNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } else {
        this.loading = false;
        this.issue = data;
      }
      this.loading = false;
    },  
      (error: any) => { 
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'ServerError'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    )
  }

  getDevices(usrId){
    this.showDevDetails = false;
    this.devList = []
    this.loading = true;
    this.getDevice.getAllDeviceList(usrId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
        if(data.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoStudentList'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        else{
          localStorage.setItem('devicesListss',JSON.stringify(data))
          this.devicesListss = JSON.parse(localStorage.getItem('devicesListss'))
          this.devList = this.devicesListss;
          this.deviceFilter();
          }
          this.loading = false;
        },
        (error: any) => { 
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'ServerError'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      )
  }

  deviceFilter() {
    // load the initial device list
    this.filteredDevices.next(this.devList);

    // listen for search field value changes
    this.deviceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterdevLists();
      });
  }

  protected filterdevLists() {
    if (!this.devList) {
      return;
    }
    // get the search keyword
    let search = this.deviceFilterCtrl.value;
    if (!search) {
      this.filteredDevices.next(this.devList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the devices
    this.filteredDevices.next(
      this.devList.filter(device => device.name.toLowerCase().indexOf(search) > -1)
    );
  }

  // on device selection get its value
  onSelection(event: Event, student) {
    this.showTable = true;
    this.student = student.student_id;
    this.imeiNo = student.imei_no;
    this.simNo = student.simNo; 
    this.devName = student.name;
    this.getDeviceInfoAndIssue(this.student, this.imeiNo)
    let inputData =  {
      "event":"start_track",
        "student_id": +this.student
    };
    this.liveLocServ.sendMsg(inputData);

  }
  response: any;
  responseData: any;
  message: any;
  onItemChange(event) {   
    var inputData =  {
    "event":"send_command",
    "student_id": +this.student,
    "data":{
      "command": 'STATUS#',
      "device":this.imeiNo,
      "deviceName": this.devName,
      "loginName": this.userLoginName,
    } 
  }
  this.liveLocServ.sendMsg(inputData);
  this.liveLocServ.messages.takeUntil(this.ngUnsubscribe)
  .subscribe(res => {
    this.response = res;
    this.responseData = JSON.parse(this.response.data);
    this.message = this.responseData.msg;
  })
  }
 
  getDeviceInfoAndIssue(std_id, imei_no) {
    this.beatInfo = [];
    this.loading = true;
    this.issueService.GetDeviceInfoAndIssue(std_id, imei_no)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data) => {
      this.loading = false;
      this.showDevDetails = true;
      this.data = data;
      this.beatInfo = this.data.beatInfoList;
      
      },
      (error: any) => { 
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'ServerError'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    )

  }

  saveIssue() {
    if( this.addIssueForm.invalid) {
      return
    }
    else {
      let std_id= {
        student_id: this.student
      }
      this.loading = true;
      this.issueService.saveIssue(Object.assign(std_id, this.addIssueForm.value))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Message)=>{
          if(data.error == "true"){
            this.loading = false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueNotAdded'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          } else {
            this.loading = false;
            // this.dialogRef.close()
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'IssueAdded',
              ticketId: data.id
            };
          this.addIssueForm.reset();
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig);
          }
        })
    }
  }

  reset() {
    this.addIssueForm.reset();
  }
}
