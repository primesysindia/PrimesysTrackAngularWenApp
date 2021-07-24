import { Component, ViewChildren, ElementRef, QueryList, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { ArrowDivDirective } from '../services/arrow-div.directive';
import { KeyboardService } from '../services/keyboard.service';
import { MatTable } from '@angular/material/table';
import { GetDeviceService } from '../services/get-device.service';
import { User } from '../core/user.model';
import { DevicesInfo, GetTripMaster } from '../core/devicesInfo.model';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatDialog, MatDialogConfig} from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { AddTripMasterComponent } from '../add-trip-master/add-trip-master.component';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { trigger, transition, style, animate } from '@angular/animations';
import { PateolmenUsernameDialogComponent } from '../beat-module/pateolmen-username-dialog/pateolmen-username-dialog.component';
import { BeatServicesService } from '../services/beat-services.service';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patrolmen-beat-update',
  templateUrl: './patrolmen-beat-update.component.html',
  styleUrls: ['./patrolmen-beat-update.component.css'],
  animations: [
    trigger('slideVerticle', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1, display: 'none' }),
        animate('500ms', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ])
    ])
  ],
})


export class PatrolmenBeatUpdateComponent implements OnInit {
  season = [
    {value: "1", name: 'Summer'},
    {value: "2", name: 'Rainy'},
    {value: "3", name: 'Winter'}
];
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild(MatTable) table: MatTable<any> //used when add a row, see comment in function add()
  @ViewChild('second') second: MatTable<any>;
  displayedColumns: string[] = ['Device-No','SectionName', 'KmStart', 'KmEnd','start_time1','end_time1','start_time2','end_time2','start_time3','end_time3','start_time4','end_time4','start_time5','end_time5','start_time6','end_time6','start_time7','end_time7','start_time8','end_time8','delete'];

  tableColumns: string[] = ['DeviceName','Section','kmStart', 'kmEnd','del'];
  // deviceList: any;
  currUser: User;
  devicesList: Array<DevicesInfo>;
  devList: Array<DevicesInfo>;
  loading: boolean;
  userType: any;
  tripData: any;
  section: any;
  selected: any;
  result: any;
  patrolmenBeatForm: FormGroup;
  patrolmenFormArray: FormArray;
  patrolmentripList: FormArray;
  control: FormArray;
  patrolmenForm: boolean = true;
  showBeatCard: boolean = true;
  season_id: any;
  existingData: any;
  beatData: any;
  existingKmStart: any;
  existingKmEnd: any;
  hierarchyData: any;
  parId: any;
  filteredDevices: any;
  selectedDeviceArray: any = [];
  duplicateValues: any;

  @ViewChildren(ArrowDivDirective) inputs: QueryList<ArrowDivDirective>


  constructor(private keyboardServ: KeyboardService,
    private fb: FormBuilder,
    private getDevice:GetDeviceService,
    private beatService: BeatServicesService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.patrolmenBeatForm = this.fb.group({ 
      'seasonId': ['', Validators.required],
      'hierarchy':['', Validators.required],
      'patrolmenFormArray': this.fb.array([])
    })

    this.patrolmentripList = this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;

    for (let i=0;i<20;i++) {
      this.addRow();
    }

    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;
    this.GetRailwayDeptHierarchy(this.parId)
    this.loading = false;
    this.keyboardServ.keyBoard.subscribe(res => {
      this.move(res)
    })
  }
  hideSeekReportCard(){
    this.showBeatCard = !this.showBeatCard
  }
  get pf() { return this.patrolmenBeatForm.controls; }


  get getFormControls() {
    const control = this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
    return control;
  }

  ngAfterOnInit() {
    this.control = this.patrolmenBeatForm.get('patrolmenFormArray ')as FormArray;
  }

  // patrolmen form array
  createPatrolmenBeat (): FormGroup {
    return this.fb.group({
      StudentId: ['', Validators.required],
      SectionName: ['', Validators.required],
      KmStart:  ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      KmEnd: ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      start_time1: ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time2:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time3:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time4:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time5:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time6:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time7:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time8:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time1: ['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time2:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time3:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time4:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time5:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time6:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time7:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time8:['', [Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      BeatId1:['0'],
      BeatId2:['0'],
      BeatId3:['0'],
      BeatId4:['0'],
      BeatId5:['0'],
      BeatId6:['0'],
      BeatId7:['0'],
      BeatId8:['0'],
      tripMasterId1:['0'],
      tripMasterId2:['0'],
      tripMasterId3:['0'],
      tripMasterId4:['0'],
      tripMasterId5:['0'],
      tripMasterId6:['0'],
      tripMasterId7:['0'],
      tripMasterId8:['0']
    })
  }
  
  addRow() {
    const control =  this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
    control.push(this.createPatrolmenBeat());
  }

  delete(index: number) {
    // this.patrolmenFormArray.removeAt(index);
    const control =  this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
    if (index > 0)
      control.removeAt(index);
    this.table.renderRows()
  }

  // add row one by one to the table
  add() {
    this.patrolmentripList.push(this.createPatrolmenBeat());
    this.table.renderRows()
  }
  
  move(object) {
    const inputToArray = this.inputs.toArray()
    const rows = this.patrolmenFormArray.length
    const cols = this.displayedColumns.length
    let index = inputToArray.findIndex(x => x.element === object.element)
    switch (object.action) {
      case "UP":
        index--;
        break;
      case "DOWN":
        index++;
        break;
      case "LEFT":
        if (index - rows >= 0)
          index -= rows;
        else {
          let rowActual = index % rows;
          if (rowActual > 0)
            index = (rowActual - 1) + (cols - 1) * rows;
        }
        break;
      case "RIGTH":
        // console.log(index + rows, inputToArray.length)
        if (index + rows < inputToArray.length)
          index += rows;
        else {
          let rowActual = index % rows;
          if (rowActual < rows - 1)
            index = (rowActual + 1);

        }
        break;
    }
    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
    }
  }

  GetRailwayDeptHierarchy(parentId) {
    this.devList = [];
    this.loading = true;
    this.beatService.GetRailwayDepHierarchy(parentId).subscribe((res)=> {
      this.loading = false;
      this.hierarchyData = res;
      this.sectionName();
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

  sectionName() {
    this.loading = true;
    this.getDevice.getSectionName(this.currUser.usrId).takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data;
      // this.getDevices();
    })
  }

  getSelectedDevice(event) {
    this.selectedDeviceArray = [];
    ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray)).reset();
    ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray)).enable();
    this.getDevices(event.hirachyParentId);
  }

  getDevices(pId){
    this.loading = true;
    this.getDevice.getAllDeviceList(pId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
        if(data.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoDeviceList'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        else{
          this.devList = data;
          this.filteredDevices = this.devList.filter(p => String(p.name).startsWith('P/'));
          this.loading = false;
        }
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

  onChange(data, index: number) {
    this.season_id = this.patrolmenBeatForm.get('seasonId').value;
    this.beatService.getPatrolmenBeatByStdId(data.student_id, this.season_id)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data) => {
      this.existingData = data;
      if(this.existingData.kmStart &&  this.existingData.kmEnd) {
        this.existingKmStart = this.existingData.kmStart.toString();
        this.existingKmEnd = this.existingData.kmEnd.toString();
      }
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('KmStart').patchValue(this.existingKmStart);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('KmEnd').patchValue(this.existingKmEnd);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('SectionName').patchValue(this.existingData.sectionName);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time1').patchValue(this.existingData.tripStartTime1);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time1').patchValue(this.existingData.tripEndTime1);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time2').patchValue(this.existingData.tripStartTime2);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time2').patchValue(this.existingData.tripEndTime2);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time3').patchValue(this.existingData.tripStartTime3);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time3').patchValue(this.existingData.tripEndTime3);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time4').patchValue(this.existingData.tripStartTime4);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time4').patchValue(this.existingData.tripEndTime4);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time5').patchValue(this.existingData.tripStartTime5);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time5').patchValue(this.existingData.tripEndTime5);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time6').patchValue(this.existingData.tripStartTime6);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time6').patchValue(this.existingData.tripEndTime6);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time7').patchValue(this.existingData.tripStartTime7);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time7').patchValue(this.existingData.tripEndTime7);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time8').patchValue(this.existingData.tripStartTime8);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time8').patchValue(this.existingData.tripEndTime8);

       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId1').patchValue(this.existingData.beatId1);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId2').patchValue(this.existingData.beatId2);
        ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId3').patchValue(this.existingData.beatId3);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId4').patchValue(this.existingData.beatId4);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId5').patchValue(this.existingData.beatId5);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId6').patchValue(this.existingData.beatId6);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId7').patchValue(this.existingData.beatId7);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId8').patchValue(this.existingData.beatId8);
    })

    this.selectedDeviceArray.push(data.student_id)
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    this.duplicateValues = findDuplicates(this.selectedDeviceArray)
    for(var i = 0; i < this.selectedDeviceArray.length; i++) {
      for(var j=0; j < this.duplicateValues.length;j++) {
        if(this.selectedDeviceArray[i] == this.duplicateValues[j]) {
          ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).disable();
          // this.toastRef = this.toastr.error('Duplicate selection of device', 'Error', {
          //   timeOut: 20000,
          // });
          // alert("duplicate")
          break;
        } 
        else {
          // this.toastr.clear(this.toastRef.ToastId);
          ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).enable();
        }
      }
    }
  }
  
   // open dialog of add patrolman trip master
   openMasterDialog(): void {
    let dialogRef = this.dialog.open(AddTripMasterComponent, {
      width: '600px',
    }).afterClosed().subscribe((result) => {
    })
  }

  submit() {
    if(this.patrolmenBeatForm.invalid){
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        hint: 'invalidForm'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    }
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '700px';
      dialogConfig.height = '250px';
      dialogConfig.data = {
        data: this.patrolmenBeatForm.value,
    };
    let dialogRef = this.dialog.open(PateolmenUsernameDialogComponent, dialogConfig)
    .afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
