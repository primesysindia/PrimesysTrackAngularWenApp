import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { BeatServicesService } from '../../services/beat-services.service';
import { Message } from 'src/app/core/message.model';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatPaginator } from '@angular/material/paginator';
import { getPatrolmenBeats} from '../../core/beatInfo.model';
import { FormArray, FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { PdfServiceService } from '../../services/pdf-service.service';
import { DatePipe } from 'node_modules/@angular/common';
declare let pdfMake: any ;


@Component({
  selector: 'app-all-patrolmen-existing-beats',
  templateUrl: './all-patrolmen-existing-beats.component.html',
  styleUrls: ['./all-patrolmen-existing-beats.component.css']
})
export class AllPatrolmenExistingBeatsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
   private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  tableHeader: Array<string> = ['DeviceName', 'KmStart', 'KmEnd', 'SectionName','Trip-1', 'Trip-2', 'Trip-3', 'Trip-4', 'Trip-5', 'Trip-6', 'Trip-7', 'Trip-8'];
  dataSource : MatTableDataSource<getPatrolmenBeats>;
  loading: any;
  currUser: any;
  parId: any;
  response: any;
  responseData: any;
  showPatrolmen: boolean = false;
  showKeymen: boolean = false;
  seasonId: any;
  patrolmenBeatForm: FormGroup;
  season = [
    {value: '1', viewValue: 'Summer'},
    {value: '2', viewValue: 'Rainy'},
    {value: '3', viewValue: 'Winter'}
  ];

  constructor(private beatService: BeatServicesService,
    public dialog: MatDialog,private fb: FormBuilder) { }

  ngOnInit() {
    this.patrolmenBeatForm = this.fb.group({ 
      'seasonId': ['1', Validators.required],
    })
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;
    this.loading = true;
    var season = 1;
    this.beatService.getPatrolmenExistingBeat(this.parId, season)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: Array<getPatrolmenBeats>) => {
      // console.log("data", data)
      if(data.length==0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'beatNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else {
        this.responseData = data;
        this.response = new MatTableDataSource<getPatrolmenBeats>(this.responseData);
        this.dataSource = this.response;
        this.dataSource.paginator = this.paginator;
        // console.log("this", this.dataSource)
      } 
      this.loading = false;
  })
  }

  onSelection(event) {
    this.seasonId = event.value;
    this.loading = true;
    this.beatService.getPatrolmenExistingBeat(this.parId, this.seasonId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: Array<getPatrolmenBeats>) => {
      // console.log("data", data)
      if(data.length==0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'beatNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else {
        this.responseData = data;
        this.response = new MatTableDataSource<getPatrolmenBeats>(this.responseData);
        this.dataSource = this.response;
        this.dataSource.paginator = this.paginator;
        // console.log("this", this.dataSource)
      } 
      this.loading = false;
  })
  }

   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  generatePdf() {
   
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).download('All Patrolmen Beats');
    // pdfMake.createPdf(documentDefinition).open();
  }

  getDocumentDefinition() {
    return {
      content: [
        {
        image: 'data:image/png;base64,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',
          width: 40,
          alignment : 'left'
        },
        {
          text: 'ALL PATROLMEN BEAT' ,
          bold: true,
          fontSize: 14,
          alignment: 'center',
          // margin: [0, 10, 0, 0]
        },

        {
          text: 'Division:' + ' ' + this.currUser.userName,
          style: 'header',
          alignment: 'center',
        },
        this.getBeatObject(this.responseData),
       
      ],
      info: {
        title: 'Beat Status',
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 20],
          alignment: 'center',
        },
        name: {
          fontSize: 16,
          bold: true
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
          fillColor: '#dedede',
          fontSize: 8,
          alignment: 'center',
        }
      }
    };
  }

  getBeatObject(beats: getPatrolmenBeats[]) {
    return {
      // layout: 'lightHorizontalLines',
      fontSize: 8,
      alignment: 'center',
      table: {
        widths: [50,30,30,30,35,35,35,35,35,35,35,35],
        
         headerRows: 1,
        body: [
          [{
            text: 'DeviceName',
            style: 'tableHeader'
          },
          {
            text: 'KmStart',
            style: 'tableHeader'
          },
          {
            text: 'KmEnd',
            style: 'tableHeader'
          },
          {
            text: 'Section',
            style: 'tableHeader'
          },
          {
            text: 'Trip-1',
            style: 'tableHeader'
            },
           {
            text: 'Trip-2',
            style: 'tableHeader'
          },
           {
            text: 'Trip-3',
            style: 'tableHeader'
          },
          {
            text: 'Trip-4',
            style: 'tableHeader'
          },
          {
            text: 'Trip-5',
            style: 'tableHeader'
          },
           {
            text: 'Trip-6',
            style: 'tableHeader'
          },
          {
            text: 'Trip-7',
            style: 'tableHeader'
          },
          {
            text: 'Trip-8',
            style: 'tableHeader'
          },
         
          ],
          ...beats.map(beat => {
            return ([
              beat.deviceName, beat.kmStart, beat.kmEnd, beat.sectionName, 
              beat.tripTime[0] ? beat.tripTime[0].startTime.slice(0,-3)  + '-' + beat.tripTime[0].endTime.slice(0,-3) : '--', 
              beat.tripTime[1] ? beat.tripTime[1].startTime.slice(0,-3)  + '-' + beat.tripTime[1].endTime.slice(0,-3) : '--',
              beat.tripTime[2] ? beat.tripTime[2].startTime.slice(0,-3)  + '-' + beat.tripTime[2].endTime.slice(0,-3) : '--',
              beat.tripTime[3] ? beat.tripTime[3].startTime.slice(0,-3)  + '-' + beat.tripTime[3].endTime.slice(0,-3) : '--',
              beat.tripTime[4] ? beat.tripTime[4].startTime.slice(0,-3)  + '-' + beat.tripTime[4].endTime.slice(0,-3) : '--',
              beat.tripTime[5] ? beat.tripTime[5].startTime.slice(0,-3)  + '-' + beat.tripTime[5].endTime.slice(0,-3) : '--',
              beat.tripTime[6] ? beat.tripTime[6].startTime.slice(0,-3)  + '-' + beat.tripTime[6].endTime.slice(0,-3) : '--',
              beat.tripTime[7] ? beat.tripTime[7].startTime.slice(0,-3)  + '-' + beat.tripTime[7].endTime.slice(0,-3) : '--',
            ]); 
          }),
        ]
      }
    };
  }

}
