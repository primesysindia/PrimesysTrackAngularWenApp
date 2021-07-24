import { Component, OnInit, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { ArrowDivDirective } from '../services/arrow-div.directive';
import { KeyboardService } from '../services/keyboard.service';
import { MatTable } from '@angular/material/table';
import { GetDeviceService } from '../services/get-device.service';
import { User } from '../core/user.model';
import { DevicesInfo, GetTripMaster } from '../core/devicesInfo.model';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { BeatServicesService } from '../services/beat-services.service';
import { ConfirmDialogComponent } from '../beat-module/confirm-dialog/confirm-dialog.component';
import { UsernameDialogComponent } from '../beat-module/username-dialog/username-dialog.component';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-keymen-beat-update',
  templateUrl: './keymen-beat-update.component.html',
  styleUrls: ['./keymen-beat-update.component.css']
})

export class KeymenBeatUpdateComponent implements OnInit {  
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild('second') second: MatTable<any>;
  tableColumns: string[] = ['DeviceName','Section','kmStart', 'kmEnd', 'startEnd_time', 'del','add'];
  // deviceList: any;
  currUser: User;
  devicesList: Array<DevicesInfo>;
  devList: Array<DevicesInfo>;
  loading: boolean;
  userType: any;
  section: any;
  deviceImei: any;
  deviceName: any;
  devices: any;
  keymenBeatForm: FormGroup;
  keymenformArray: FormArray;
  keymentripList: FormArray;
  control: FormArray;
  parId: any;
  result: any;
  existingKmEnd: any;
  existingKmStart: any;
  existingSectionName: any;
  beatId: any;
  selectedDeviceArray: any = [];
  selected: any = [];
  toastRef : any;
  duplicateValues: any;
  hierarchyData: any;
  filteredDevices: any;
  responseData: any;
  existingstrtKm: any;

  @ViewChildren(ArrowDivDirective) inputs: QueryList<ArrowDivDirective>

  constructor(private keyboardServ: KeyboardService,
    private fb: FormBuilder,
    private getDevice:GetDeviceService,
    private beatService: BeatServicesService,
    public dialog: MatDialog, 
    private router: Router) { }

  ngOnInit() {
    this.keymenBeatForm = this.fb.group({ 
      'hierarchy':['', Validators.required],
      'keymenformArray': this.fb.array([])
    })
    this.keymentripList = this.keymenBeatForm.get('keymenformArray') as FormArray;
    for (let i=0;i<20;i++) {
      this.addRowForKeymen(i);
    }
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;
    this.GetRailwayDeptHierarchy(this.parId)

    this.keyboardServ.keyBoard.subscribe(res => {
      this.move(res)
    })
  }
  get kf() { return this.keymenBeatForm.controls; }

  move(object) {
    const inputToArray = this.inputs.toArray()
    const rows = this.keymenformArray.length
    const cols = this.tableColumns.length
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
        console.log(index + rows, inputToArray.length)
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
      this.getSectionName();
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

  getSectionName() {
    this.loading = true;
    this.getDevice.getSectionName(this.currUser.usrId).takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data;
    })
    this.loading = false;
  }
  getSelectedDevice(event) {
    this.selectedDeviceArray = [];
    ((this.keymenBeatForm.get('keymenformArray') as FormArray)).reset();
    ((this.keymenBeatForm.get('keymenformArray') as FormArray)).enable();
    this.getDevices(event.hirachyParentId);
  }

  getDevices(pId){
    this.devList = [];
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
          this.filteredDevices = this.devList.filter(p => String(p.name).startsWith('K/'));
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
    ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get('kmStart').patchValue('');
    ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get('kmEnd').patchValue('');
    ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get('sectionName').patchValue(''); 
    ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get('startTime').patchValue('');
    ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get('beatId').patchValue('0');
    this.beatService.getKeymenExistingBeat(this.parId, data.student_id)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data) => {
      if(data) {
        this.existingKmStart = data[0].KmStart.toString();
        this.existingKmEnd = data[0].KmEnd.toString();
        this.existingSectionName = data[0].SectionName.toString();
        this.beatId = data[0].beatId.toString();
        this.existingstrtKm = data[0].startTime/3600 + '-' + data[0].EndTime/3600;
        ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get("kmStart").patchValue(this.existingKmStart);
        ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get("kmEnd").patchValue(this.existingKmEnd);
        ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get("sectionName").patchValue(this.existingSectionName);
        ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get("beatId").patchValue(this.beatId);
        ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).get('startTime').patchValue(this.existingstrtKm);
         
      }
    })

    this.selectedDeviceArray.push(data.student_id)
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    this.duplicateValues = findDuplicates(this.selectedDeviceArray)
    for(var i = 0; i < this.selectedDeviceArray.length; i++) {
      for(var j=0; j < this.duplicateValues.length;j++) {
        if(this.selectedDeviceArray[i] == this.duplicateValues[j]) {
          ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).disable();
          // this.toastRef = this.toastr.error('Duplicate selection of device', 'Error', {
          //   timeOut: 20000,
          // });
          // alert("duplicate")
          break;
        } 
        else {
          // this.toastr.clear(this.toastRef.ToastId);
          ((this.keymenBeatForm.get('keymenformArray') as FormArray).at(index) as FormGroup).enable();
        }
      }
    }
  }
  createKeymenBeat (index): FormGroup {
    return this.fb.group({
      'studentId': ['', Validators.required],
      'sectionName': ['', Validators.required],
      'kmStart': ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      'kmEnd': ['',[Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      'beatId': ['0'],
      'startTime': ['']
    })
  }

  addRowForKeymen(index) {
    const controls = this.keymenBeatForm.get('keymenformArray') as FormArray;
    controls.push(this.createKeymenBeat(index));
  }

  addextraRowsForKeymen(index) {
    const controls =  this.keymenBeatForm.get('keymenformArray') as FormArray;
    controls.push(this.createKeymenBeat(index));
    this.second.renderRows()
  }

  // public hasErrorInSetPeriod = (controlName: string, errorName: string) =>{
  //   return this.keymenBeatForm.controls[controlName].hasError(errorName);
  // }

  get getKeymenFormControls() {
    const controls = this.keymenBeatForm.get('keymenformArray') as FormArray;
    return controls;
  }

  getTripsFormGroup(index): FormGroup {
    const formGroup = this.keymentripList.controls[index] as FormGroup;
    return formGroup;
  }

  deleteRow(index: number) {
    const control =  this.keymenBeatForm.get('keymenformArray') as FormArray;
    if (index > 0)
      control.removeAt(index);
    this.second.renderRows();
  }

  submit() {
    if(this.keymenBeatForm.invalid) {
      return
    }
     else {
        const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '700px';
          dialogConfig.data = {
            data: this.keymenBeatForm.value,
            // beatId: '0'
          };
          let dialogRef = this.dialog.open(UsernameDialogComponent, dialogConfig)
          .afterClosed().subscribe(dialogResult => {
            this.result = dialogResult;
          });
      }
     
  }
}
