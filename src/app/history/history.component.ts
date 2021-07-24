 /// <reference path="../../../node_modules/@types/marker-animate-unobtrusive/index.d.ts" />
import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { User } from '../core/user.model';
import { DevicesInfo } from '../core/devicesInfo.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GetHistoryService } from '../services/get-history.service';
import { HistoryInfo } from '../core/historyInfo.model';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { ReportService } from '../services/report.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { DatePipe } from '@angular/common';
import { SortDevicesPipe } from '../filters/sort-devices.pipe';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { HistoryInfoData, BatteryInfoData } from '../core/historyInfoData.model';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';

export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MMM-YY HH:mm',
  fullPickerInput: 'DD-MMM-YY HH:mm',
  datePickerInput: 'LL',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
declare var google: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('150ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ],
  providers: [
    SortDevicesPipe,
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ]
})
export class HistoryComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  lat: number;
  lng: number;
  currUser: User;
  devicesList: Array<DevicesInfo>;
  devList: Array<DevicesInfo>;
  searchText: string;
  selectedItem: string;
  showSortByType: boolean;
  sortType: string[] = ['All', 'KeyMan', 'PatrolMan', 'Mate'];
  sortBy: string = "All";
  selectedDevice: DevicesInfo;
  historyForm: FormGroup;

  /* Calendar date validations */
  d:Date = new Date();
  public selectedDateTime: Date;
  minDate: Date;
  maxDate: Date;
  dateError:any={isError:false,errorMessage:''};
  
  //Track History data
  protected map: any;
  zoomLevel:number = 5;
  markers: Array<any>=[];
  icon: string = '../assets/dot.svg';
  blindIcon: string = '../assets/yellow-circle.svg'
  myLocation: Array<any>=[];
  public polylines: Array<any>;
  maxSpeed: number;
  address: string;
  mapTypeId: string;
  RoadmapView: boolean = true;
  trackHistory: Array<HistoryInfo>;
  speedChange: number;
  showMsg: string;
  endTime: number;
  USAUser: boolean = false;
  //Infocard
  showInfoCard: boolean = true;
  showNetCard: boolean = true;
  showBatCard: boolean = true;
  currDevice: string;
  currSpeed: number;
  currDate: number;
  beatInfo: any;
  showbeatDialog: boolean = false;

  //spinner
  public loading:boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  //marker animation
  isPlaying:boolean = false
  pauseAnimation:boolean =false;
  clickCnt: number = 0;
  animationMarker: Array<any> = [];
  index: number = 0;
  marker: any;
  interval = 1200;
  locationCnt: number =0;
  cnt: number = 0;

  //Battery chart
  batChartLegend: any;
  batChartData: any;
  batChartLabel: any;
  batChartOptions: any;
  batChartType: string;
  batShowChart:boolean = false;
  batChartColor: any;
  showBatteryChart: boolean = false;
  //Chart
  chartData: any;
  chartLabel: any;
  chartOptions: any;
  chartLegend: any;
  chartType: string;
  showChart:boolean = false;
  chartColor: any;
// network chart
  //Battery chart
  netChartLegend: any;
  netChartData: any;
  netChartLabel: any;
  netChartOptions: any;
  netChartType: string;
  netShowChart:boolean = false;
  netChartColor: any;
  showNetworkChart: boolean = false;
  //css
  screenHeight:any;
  screenWidth:any;
  showDeviceList: boolean = true;
  //RDPS Data
  browserName: string = localStorage.getItem('browserName');
  db:any;
  sortedFeatureAdrs: Array<any>=[];
  showFeatureAddress:boolean = false;
  rdpsDataAvail: boolean;
  
  sTime: any;
  eTime: any;
  batteryData:Array<any> = [];
  batInfo: any = [];
  battery: Array<any> = [];
  time: Array<any> = [];
  batteryInfo: any = [];
     
  constructor(public dialog: MatDialog,
              private history: GetHistoryService,
              private reportServ: ReportService,
              public datePipe: DatePipe,
              private sortPipe: SortDevicesPipe,
              private fb: FormBuilder){}

  public mapReady(map: GoogleMap) {
    let mapOptions = {
      minZoom: 5,
      center: new google.maps.LatLng(this.lat, this.lng),
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.TERRAIN, 'map_style', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID]
      },
      fullscreenControl:true
    };
    //for highlight rail track on google map
    if(this.currUser.accSqliteEnable == 0){
        var styledMap = new google.maps.StyledMapType([
          {
          "featureType": "administrative",
          "elementType": "all",
          "stylers": [
                      {
                      "visibility": "off"
                      }
                      ]
          },
        
        
             {
               "featureType": "transit",
               "stylers": [
                 {
                   "visibility": "on"
                 }
               ]
             },
             {
               "featureType": "transit.station.rail",
               "elementType": "geometry.fill",
               "stylers": [
                 {
                   "visibility": "on"
                 }
               ]
             },
             {
               "featureType": "transit.station.rail",
               "elementType": "labels.icon",
               "stylers": [
                 {
                   "visibility": "on"
                 },
                 {
                   "weight": 5
                 }
               ]
             },
             {
               "featureType": "transit.station.rail",
               "elementType": "labels.text",
               "stylers": [
                 {
                   "color": "#813f4b"
                 },
                 {
                   "visibility": "on"
                 },
                 {
                   "weight": 4.5
                 }
               ]
             },
             {
               "featureType": "transit.station.rail",
               "elementType": "labels.text.fill",
               "stylers": [
                 {
                   "saturation": -45
                 },
                 {
                   "lightness": 100
                 },
                 {
                   "visibility": "simplified"
                 },
                 {
                   "weight": 4.5
                 }
               ]
             },
             {
               "featureType": "transit.station.rail",
               "elementType": "labels.text.stroke",
               "stylers": [
                 {
                   "visibility": "on"
                 }
               ]
             }
           ,
          {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
                      {
                      "visibility": "on"
                      }
                      ]
          },
          {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
                      {
                      "color": "#6f4e37"
                      }
                      ]
          },
        
          {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
                      {
                      "color": "#0dabeb"
                      }
                      ]
          }
          ], {
          name: "Styled Map"
        });
        this.map = map
        this.map.setOptions(mapOptions)
        this.map.mapTypes.set('map_style', styledMap);
        this.map.setMapTypeId('map_style');
        this.mapTypeId = "map_style"
    }
    else{
      this.map = map
      this.map.setOptions(mapOptions)
      this.map.setMapTypeId('roadmap');
      this.mapTypeId = "roadmap"
    }
  }

  public setMapType(){
    if(this.currUser.accSqliteEnable == 0){
      if(this.mapTypeId == 'map_style')
      {
        this.mapTypeId = "hybrid"
        this.map.setMapTypeId('hybrid');
        this.RoadmapView = false
      }
      else{
        this.mapTypeId = "map_style"
        this.map.setMapTypeId('map_style');
        this.RoadmapView = true
      }
    }
    else{
      if(this.mapTypeId == 'roadmap'){
        this.mapTypeId = "hybrid"
        this.map.setMapTypeId('hybrid');
        this.RoadmapView = false
      }
      else{
        this.mapTypeId = "roadmap"
        this.map.setMapTypeId('roadmap');
        this.RoadmapView = true
      }
    }
  }

  ngOnInit() {
    this.rdpsDataAvail = JSON.parse(localStorage.getItem('featureAdrsAvailable'));
    this.USAUser = JSON.parse(localStorage.getItem('USAUser'))
    //method for fetching device list
    this.getDevices()
    if(this.currUser.accSqliteEnable == 0){
      if(this.currUser.usrId != 534830){
        this.showSortByType = true;
      }
    }
    this.minDate = new Date(this.d.getFullYear(),this.d.getMonth()-3,this.d.getDate());
    this.maxDate = new Date();
    this.historyForm = this.fb.group({
      deviceNm: ['', Validators.required],
      fromTime: [new Date(this.d.setHours(5,0)), Validators.required],
      toTime: [this.maxDate, Validators.required]
    })

// commented on 24-feb-2021    
    // if(this.USAUser){
    //   this.lat = 38.450362;
    //   this.lng = -76.895380;
    // }
    // else{
      this.lat = 20.593683;
      this.lng = 78.962883;
    // }
  }

  get f() { return this.historyForm.controls; }

  getStyle(){
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.devicesList){
      if(this.devicesList.length == 1){
        let listShow = document.getElementsByClassName('hide-dev-list')[0] as HTMLElement;
        listShow.style.visibility = 'hidden';
      }
      if(this.devicesList.length>10){
        let styles
        if(this.screenHeight < 768){
         styles = {
            'height': "84%",
            'margin-top': '1.25rem'
          };
        }
        else if(this.screenHeight == 600){
          styles = {
             'height': "80%",
             'margin-top': '1.25rem'
           };
         }
        else{
          styles = {
            'height': "85%",
            'margin-top': '0.5rem'
          };
        }
        return styles;
      }
      else{
        let styles
        if(this.screenHeight < 720){
          styles = {
            'height': this.devicesList.length*12+'%',
            'margin-top': '1rem'
           };
         }
         else {
          styles = {
          'height': this.devicesList.length*10+'%',
          'margin-top': '1rem'
          }
        }
        return styles;
      }
    }
  }

  setToDate(){
    if(this.f.fromTime.value !== undefined){
      if((this.f.fromTime.value + 28800000) > new Date().getTime())
        this.f.toTime.setValue(new Date(this.maxDate.getTime()))
      else
        this.f.toTime.setValue(new Date(this.f.fromTime.value + 28800000))
    }
    else{
      this.f.toTime.setValue(new Date(this.maxDate.getTime()))
    }
    this.dateError= {isError: false, errorMessage: "" }
    this.showMsg = ""
  }

  compareTwoDates(){
    if(this.f.toTime.value !== undefined){
      if(this.f.fromTime.value > this.f.toTime.value){
        this.dateError= {isError: true, errorMessage: "End time must be greater than start time." }
      }
      else if((this.f.toTime.value-this.f.fromTime.value) > 28800000){
          this.dateError= {isError: true, errorMessage: "End time must NOT be greater than 8 hrs from Start time." }
      }
      else{
        this.dateError= {isError: false, errorMessage: "" }
      }
    }
    else
      this.dateError= {isError: false, errorMessage: "" }
 }

  hideSeekDevList(){
    this.showDeviceList = !this.showDeviceList
  }

  sortByType(){
    this.devList = this.sortPipe.transform(this.devicesList,this.sortBy)
  }

  getSelectedDevice(data: DevicesInfo){
    this.selectedDevice = data;
  }

  getKmLocation(feature){
    return parseInt(feature.kiloMeter) + parseInt(feature.distance)*0.001
  }

  getDevices(){
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.devicesList = JSON.parse(localStorage.getItem('devicesList'))
    this.devList = this.devicesList;
    if(this.browserName == "Chrome" && this.currUser.accSqliteEnable == 0 && this.rdpsDataAvail){
      this.db = (<any>window).openDatabase('RDPS', '', 'RDPS data', 2 * 1024 * 1024)
    } 
  }

  //call to history service for tracking history
  getHistory() {
    if(!this.historyForm.valid || this.dateError.isError){
      this.f.deviceNm.markAsTouched()
      return
    }
    else{
    this.showChart = false;
    this.showBatteryChart = false;
    this.showNetworkChart = false;
    this.showbeatDialog = false;
    this.loading = true;
    let imei,chkExpiry,deviceName;
    imei = this.selectedDevice.imei_no;
    chkExpiry = this.selectedDevice.remaining_days_to_expire;
    deviceName = this.selectedDevice.name;
    let lat, lng, speed, dateTimestamp: number;
    let startDateTime = Math.floor(this.f.fromTime.value/1000)
    let endDateTime = Math.floor(this.f.toTime.value/1000)
      //getTime() returns timestamp for the selected date & time
      if(chkExpiry>=0){
      this.history.getTrackHistory(startDateTime,endDateTime,imei)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: HistoryInfoData) =>{
            this.trackHistory = data.historyInfo;
            if(data.historyDataSize == 0){
              this.loading = false;
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                devName: deviceName
              };
              this.dialog.open(HistoryNotFoundComponent,dialogConfig);
            }
            else{
              this.markers = [];
              this.polylines = [];
              this.selectedItem = deviceName;
              this.zoomLevel = 14;
              this.clickCnt == 0;
              this.pauseAnimation = true;
              this.animationMarker = [];
              this.sortedFeatureAdrs = [];
              this.isPlaying = false;
              this.index = 0;
              this.locationCnt = data.historyInfo.length;
              this.loading = false;
              this.currDevice = deviceName;
              this.showChart = false;
              this.showBatteryChart = false;
              this.getBatteryData(this.f.fromTime.value,this.f.toTime.value,imei)
              // commented on 24-feb-2021 
              // if(this.USAUser)
              //   this.currSpeed = parseInt((+data.historyInfo[0].speed*0.621371).toFixed(2));
              // else
                this.currSpeed = parseInt(data.historyInfo[0].speed);
              this.currDate = parseInt(data.historyInfo[0].timestamp)*1000;
              
              data.historyInfo.forEach(res => {
                // commented on 24-feb-2021 
                // if(this.USAUser)
                //   speed = parseInt((+res.speed*0.621371).toFixed(2));
                // else
                  speed = parseInt(res.speed);
                dateTimestamp = parseInt(res.timestamp);
                if((res.lat_direction.includes('N') || res.lat_direction.includes('n'))
                    && (res.lan_direction.includes('E') || res.lan_direction.includes('e')))
                {
                lat = parseFloat(res.lat);
                lng = parseFloat(res.lan);
                }
                else if((res.lat_direction.includes('N') || res.lat_direction.includes('n'))
                    && (res.lan_direction.includes('W') || res.lan_direction.includes('w')))
                    {
                      lat = parseFloat(res.lat);
                      lng = -parseFloat(res.lan);
                    }
                else if((res.lat_direction.includes('S') || res.lat_direction.includes('s'))
                    && (res.lan_direction.includes('E') || res.lan_direction.includes('e')))
                    {
                      lat = -parseFloat(res.lat);
                      lng = parseFloat(res.lan);
                    }
                else if((res.lat_direction.includes('S') || res.lat_direction.includes('s'))
                      && (res.lan_direction.includes('W') || res.lan_direction.includes('w')))
                      {
                      lat = -parseFloat(res.lat);
                      lng = -parseFloat(res.lan);
                      }
                      var blindAlrm = res.isBlind;
                      var blindAlrmTimestamp = res.blindLocationGetTimestamp;
                this.markers.push({
                  lat,
                  lng,
                  speed,
                  dateTimestamp,
                  blindAlrm,
                  blindAlrmTimestamp,
                  animation: ''
                })            
              })
              this.map.setCenter({ lat: this.markers[0].lat, lng: this.markers[0].lng });
              this.lat = parseFloat(this.markers[0].lat);
              this.lng = parseFloat(this.markers[0].lng);
              this.endTime = this.markers[this.markers.length-1].dateTimestamp;
              this.showInfoCard = false;
              this.showBatCard = false;
              this.showNetCard = false;
              //myLocation array for setting marker at start and end point
              this.myLocation = [
                {
                  lat: parseFloat(this.markers[0].lat),
                  lng: parseFloat(this.markers[0].lng)
                },
                {
                  lat: parseFloat(this.markers[this.markers.length-1].lat),
                  lng: parseFloat(this.markers[this.markers.length-1].lng)
                }
              ]
              if(this.markers.length>1){
                //For getting RDPS data
                if(this.currUser.accSqliteEnable == 0){
                  this.speedChange = 8;
                  if(this.browserName=="Chrome" && this.rdpsDataAvail){
                    let idx = Math.round(this.markers.length/2)
                    this.getFeatureAddressSignal(this.markers[idx].lat ,this.markers[idx].lng).then(
                      (res:any) => {
                        for(let i=0; i< res.rows.length; i++){
                          this.sortedFeatureAdrs.push(res.rows[i])
                        }
                        // console.log(this.sortedFeatureAdrs)
                        this.showFeatureAddress = true;
                      }).catch(e => {
                        console.log(e);
                      }
                    )
                  }
                }
                else{
                  // commented on 24-feb-2021 
                  // if(this.USAUser)
                  //   this.speedChange = 65;
                  // else
                    this.speedChange = 50;
                }
                if(data.historyDataSize > 200){
                  this.showMsg = "You have more history locations available to see beyond "+
                                this.datePipe.transform(this.endTime*1000, 'HH:mm')                 
                }
                else{
                  this.showMsg = ""
                }
              }
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
        }
        )
      }
      else{
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
                //pass data to dialog
                dialogConfig.data = {
                  devName: deviceName,
                  hint: 'SubscriptionExpire'
                };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    }
  }

  getFeatureAddressSignal(lat, lan): Promise<Array<any>> {
    let queryStatement:string;
    queryStatement = "Select * from RDPSTable where" +
      " latitude != 0  and latitude between " +(lat - 0.15)
      +" and "+(lat + 0.15)  +" and longitude between" +
      " "+(lan  - 0.15)+" and "+(lan  + 0.15)
      +" order by abs("+lan + " - latitude) " +
      "+ abs("+lan +" - longitude)"
      return new Promise((resolve, reject) => {
        this.db.transaction((tx) => {
          tx.executeSql(queryStatement, [],
            (res, result) => {
              resolve(result)
            },
            (error) => reject(error));
        });
      })
  }

  // initialize speed chart
  initialiseChart(){
    this.showChart = !this.showChart;
    this.showBatteryChart = false;
    this.showNetworkChart = false;
    this.chartLegend = true;
    this.chartType = 'line';
    this.chartLabel = this.getDateTime()
    this.chartColor = [
      { //blue
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
    ]
    this.chartData = [{
      data: this.getData(),
      label: 'Speed'
    }]
    this.chartOptions = {
      /* responsive: true */
    }
  }

  // set the chart point for speed chart
  setChartPoint(data:any): void{
    if(data.active.length > 0){
      let dataIndex = data.active[0]._index
      this.markers[dataIndex].animation = 'BOUNCE'
      setTimeout(() => {
        this.markers[dataIndex].animation = ''
      },3000)
    }
  }

  // get date & time for speed chart
  getDateTime(){
    let data: Array<any> = [];
    this.markers.map(res => {
      data.push(this.datePipe.transform(res.dateTimestamp*1000, 'HH:mm'))
    })
    return data;
  }

  // get data for speed chart
  getData(){
    let data: Array<any> = [];
    this.markers.map(res => { 
      data.push(res.speed)
    })
    return data;
  }

  
  // get battery info api
  getBatteryData(startDateTime,endDateTime,imei) {
    this.sTime = this.datePipe.transform(startDateTime, 'yyyy-MM-dd 00:00')
    var strtTime = new Date(this.sTime).getTime()/1000;

    this.eTime = this.datePipe.transform(endDateTime, 'yyyy-MM-dd 23:59')
    var enTime = new Date(this.eTime).getTime()/1000;

    this.history.getBatteryInfo(strtTime,enTime,imei)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: BatteryInfoData) =>{
      this.batteryInfo = data;
      this.batInfo = this.batteryInfo;
    })
    
  }

  // initialize chart for battery graph

  initialiseBatteryChart() 
  {
    this.showChart = false;
    this.showNetworkChart = false;
    this.showBatteryChart = !this.showBatteryChart;
    this.batChartData = [];
    this.batChartLabel = [];
    this.batChartLegend = true;
    this.batChartType = 'line';
    this.batChartLabel = this.getBatDateTime();
    this.batChartColor = [
      { //blue
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '	#D3D3D3',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
    ]
    this.batChartData = [{
      data: this.getBattData(),
      label: 'Battery Level'
    }]

    this.batChartOptions = {
      // responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          // max : 100,
          min : 0,
        }
      }],
    },
    }
  }

  // get battery level
  getBattData() {
    this.battery = []
    this.batInfo.map(res => { 
      this.battery.push(res.batteryLevel)
    })
    return this.battery
  }

  // get battery timestamp
  getBatDateTime() {
    this.time = []
    this.batInfo.map(res => { 
      this.time.push(this.datePipe.transform(res.timestamp*1000, 'HH:mm'))
    })
    return this.time
  }

  // set chart points for battery graph
  setBatteryChartPoint(data:any): void{
    if(data.active.length > 0){
      let dataIndex = data.active[0]._index
      this.battery[dataIndex].animation = 'BOUNCE'
      setTimeout(() => {
        this.battery[dataIndex].animation = ''
      },3000)
    }
  }

  // initialoze chart for network graph
  initialiseNetworkChart() 
  {
    this.showChart = false;
    this.showBatteryChart = false;
    this.showNetworkChart = !this.showNetworkChart;
    this.netChartData = [];
    this.netChartLabel = [];
    this.netChartLegend = true;
    this.netChartType = 'line';
    this.netChartLabel = this.getNetDateTime();
    this.netChartColor = [
      { //blue
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '	#D3D3D3',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
    ]
    this.netChartData = [{
      data: this.getNetData(),
      label: 'Network Strength'
    }]

    this.batChartOptions = {
      // responsive: true,
    scales : {
      xAxes: [{
        ticks: {
          max : '23:59',
          min : '00:00',
          maxTicksLimit: 5,
          stepSize: 3,
        },
        type: 'time',
         time: {
                unit: 'minute'
            }
      }],
      yAxes: [{
        ticks: {
          max : 200,
          min : 0,
          maxTicksLimit: 5,
          stepSize: 3,
        }
      }],
     
    },
    }
  }

  networkData: Array<any> = [];
  // get battery level
  getNetData() {
    this.networkData = []
    this.batInfo.map(res => { 
      this.networkData.push(res.network)
    })
    return this.networkData
  }

  // get battery timestamp
  getNetDateTime() {
    this.time = []
    this.batInfo.map(res => { 
      this.time.push(this.datePipe.transform(res.timestamp*1000, 'HH:mm'))
    })
    return this.time
  }

  // set chart points for battery graph
  setNetworkChartPoint(data:any): void{
    if(data.active.length > 0){
      let dataIndex = data.active[0]._index
      this.networkData[dataIndex].animation = 'BOUNCE'
      setTimeout(() => {
        this.networkData[dataIndex].animation = ''
      },3000)
    }
  }


  startAnimation(){
    this.isPlaying = true
    this.pauseAnimation = false;
    if(this.clickCnt == 0 || this.cnt == this.locationCnt-1){
      // if marker exists and has a .setMap method, hide it
      if (this.marker && this.marker.setMap) {
        this.marker.setMap(null);
      }
      //call method for marker animation on google map
      this.setMarkerAnimation(this.interval)
    }
    else{
      this.animationMarker = [];
      for(this.index;this.index<this.markers.length;this.index++){
        this.animationMarker.push(this.markers[this.index])
      }
      this.setMarkerAnimation(this.interval)
    }
    this.clickCnt++;
  }
  
  stopAnimation(){
    this.isPlaying = false
    this.pauseAnimation = true;
  }

  increaseSpeed(time){
    if(this.interval !== 400){
      this.interval = this.interval - time;
    }
  }

  decreaseSpeed(time){
    this.interval = this.interval + time; 
  }

  //for infowindow address
  setInfo(track: any){
    this.reportServ.getAddress(track.lat, track.lng)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: any) => {
          if(data.results[0]){
            this.address = data.results[0].formatted_address;
          }
          else{
            this.address = "Address not found";
          }
      },
      (error: any) => {
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'ServerError'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
      )
    }

  private bearingBetweenLocations(latLng1, latLng2) {

    let PI = 3.14159;
    let lat1 = latLng1.lat() * PI / 180;
    let long1 = latLng1.lng() * PI / 180;
    let lat2 = latLng2.lat() * PI / 180;
    let long2 = latLng2.lng() * PI / 180;

    let dLon = (long2 - long1);

    let y = Math.sin(dLon) * Math.cos(lat2);
    let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let brng = Math.atan2(y, x);

    brng = brng * 180 / Math.PI;
    brng = (brng + 360) % 360;

    return brng;
  }

  private rotateMarker(marker, toRotation) {
    var icon = marker.getIcon();
    let rot = parseInt(toRotation);
    icon.rotation = rot;
    marker.setIcon(icon);
  }

  async setMarkerAnimation(interval){
    let myLatlng;
    let i = 0;
    if(this.clickCnt == 0){
      this.animationMarker = [];
      this.cnt = 0;
      myLatlng =  new google.maps.LatLng(this.lat, this.lng)
      this.marker = new SlidingMarker({
        position: myLatlng,
        map: this.map,
        title: "Device Movement",
        duration: 1200,
        easing: "easeOutExpo",
        icon:  {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: "#ff5050",
          fillOpacity: 1,
          strokeWeight: 1,
          anchor: new google.maps.Point(0, 5),
          rotation: 0
        }
      });
      this.animationMarker = this.markers
    }
    for(let el of this.animationMarker){
      if(this.markers.indexOf(el) == this.locationCnt-1){
        this.cnt =this.markers.indexOf(el)
        this.isPlaying = false;
        this.clickCnt = 0
        this.index = 0;
        break;
      }
      interval = this.interval;
      if(this.pauseAnimation){
        this.index = this.markers.indexOf(el)
        break;
      }
      else{
        await this.callSetTimeout(interval)
        let oldLocation = new google.maps.LatLng(el.lat, el.lng);
        let newPosition1 = new google.maps.LatLng(this.animationMarker[i+1].lat, this.animationMarker[i+1].lng);
        let bearing = this.bearingBetweenLocations(oldLocation, newPosition1);
        this.rotateMarker(this.marker, bearing);
        // commented on 24-feb-2021 
        // if(this.USAUser)
        //   this.currSpeed = +(el.speed*0.621371).toFixed(2);
        // else
          this.currSpeed = el.speed;
        this.currDate = el.dateTimestamp*1000;
        this.marker.setPosition(newPosition1);
        this.map.setCenter({lat: this.animationMarker[i+1].lat, lng: this.animationMarker[i+1].lng});
      }
      i++; 
    }
  }

  tripSTime: any;
  tripETime: any;
  getBeatInfo() {
    this.loading = true;
    this.showChart = false;
    this.showBatteryChart = false;
    this.showNetworkChart = false;
    let std_id = this.selectedDevice.student_id;
    // this.showbeatDialog = true;
    this.history.getBeatInfoOfDevices(std_id)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data) =>{
      this.loading = false;
      this.showbeatDialog = !this.showbeatDialog;
      this.beatInfo =  data;
    })
  }

  callSetTimeout(interval){
    return new Promise((res) => setTimeout(res, interval));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  
}//end class
