import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { GetDeviceService } from '../services/get-device.service';
import { User } from '../core/user.model';
import { DevicesInfo } from '../core/devicesInfo.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LocationInfo } from '../core/locationInfo.model';
import { AllDevicesLocation } from '../core/allDeviceLocation.model';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { ReportService } from '../services/report.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { PlatformLocation, DatePipe } from '@angular/common';
import { LiveLocationService } from '../services/live-location.service';
import { WebsocketService } from '../services/websocket.service';
import { SortDevicesPipe } from '../filters/sort-devices.pipe';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AllLocationPipe } from '../filters/all-location.pipe';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';
import { FeatureAddress } from '../core/featureAddress.model';
import { Router } from '@angular/router';
import { browserRefresh } from '../app.component';
import { GetHistoryService } from '../services/get-history.service';
import { BeatInfoDialogComponent } from '../beat-info-dialog/beat-info-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('150ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
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
  providers: [SortDevicesPipe, AllLocationPipe]
})
export class HomeComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public browserRefresh: boolean;
  lat: number;
  lng: number;
  currUser: User;
  devicesList: Array<DevicesInfo>;
  devList: Array<DevicesInfo>;
  showSearchText: boolean;
  status: boolean = false;
  searchText: string;
  locations: Array<LocationInfo>;
  showSortByType: boolean;
  sortType: string[] = ['All', 'KeyMan', 'PatrolMan', 'Mate'];
  sortBy: string = "All";

  //All location data
  allDevLocation: Array<AllDevicesLocation>;
  zoomLevel:number = 5;
  protected map: any;
  markers: Array<any> = [];
  allLocations: Array<any> = [];
  address: string;
  //d: Date = new Date();
  mapTypeId: string;
  RoadmapView: boolean = true;
  selectedItem:string;

  //spinner
  public loading:boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  //All device location
  userType: string = localStorage.getItem('userType');
  offDeviceCnt: number = 0;
  onDeviceCnt: number = 0;
  stoppageDevCnt: number = 0;
  pastOffDeviceCount: number = 0;
  todayOnDeviceCnt: number = 0;
  totalDevices: number;
  showInfoCard: boolean;
  showStoppageDevices: boolean = false;
  showCluster: boolean = false;
  showFeatureAddress:boolean = false;
  featureAdrs: Array<any>;
  sortedFeatureAdrs: Array<any>=[];
  showAllbtn: boolean = true;
  showInfoMsg: boolean = false;
  showRefreshbtn: boolean = false;
  showRefreshInfoMsg: boolean = false;
  SortForAllLocation: string = 'all';
  //RDPS data icons
  featureIcon: string ="http://www.mykiddytracker.com:81";
  imagesUrl: string ="http://mykiddytracker.com:81/Images/"
  browserName: string = localStorage.getItem('browserName')
  rdpsDataAvail: boolean;
  railwayUser: boolean = false;
  //live tracking data
  USAUser: boolean;
  liveTrack: LocationInfo;
  currLocation: Array<any> = [];
  liveLocation: Array<any> = [];
  showLiveLocation: boolean = false;
  overspeedLimit: number;
  selectedDevice: string;
  currAddress: string;
  currSpeed: number;
  currDate: number;
  iconUrl: string = '../assets/dot.svg';
  location1: any;
  location2: any;
  marker: any;
  car: string = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z"
  selDeviceType: string;
  selDevice: string;
  markerIcon:string;
  showGoogleAddress: string;
  smallestDistance: any;
  locationKmPole: string;
  smallDistance: string;
  batteryImage: string;
  gsmSignalImage: string;
  batteryLevel: string;
  gsmSignalLevel: string;
  showCurrAddress: boolean = false;
  selectedDeviceSId: any;
  showBeatBtn: boolean = true;
  showbeatDialog: boolean = false;
  beatInfo: any;
  allDevicesLocation: Array<any> = []
  @ViewChild('liveLocMarker') liveLocMarker: ElementRef;
  //css
  screenHeight:any;
  screenWidth:any;
  showDeviceList: boolean = true;
  yesterTimestamp: any;
  //webSQL database
  db: any;
  
  constructor(private getDevice:GetDeviceService,
              public dialog: MatDialog,
              public reportServ: ReportService,
              public location: PlatformLocation,
              private liveLocServ: LiveLocationService,
              private wsServ: WebsocketService,
              private sortPipe: SortDevicesPipe,
              private allLocationPipe: AllLocationPipe,
              public datePipe: DatePipe,
              private sanitizer: DomSanitizer,
              private loginServ: LoginService,
              private historyServ: GetHistoryService,
              private router: Router) 
  {}

  public mapReady(map) {
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
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'))
    this.USAUser = JSON.parse(localStorage.getItem('USAUser'))
    //method for socket connection
    this.initIoConnection();
    //method for fetching device list
    this.getDevices()
    /* //method for fetching all device locations
    this.getAllDeviceLocation(); */
    this.devicesList = JSON.parse(localStorage.getItem('devicesList'))
    this.devList = this.devicesList
    this.showSearchText = JSON.parse(localStorage.getItem('showSearchText'))
    this.featureAdrs = JSON.parse(localStorage.getItem('featureAddress'))

    this.showInfoMsg = true;
    setTimeout(()=>{
      this.showInfoMsg = false;
    }, 5000)
    this.rdpsDataAvail = JSON.parse(localStorage.getItem('featureAdrsAvailable'))
    if(this.currUser.accSqliteEnable == 0){
      this.railwayUser = true;  
      //check if using chrome browser
      let isChrome;
      let browserName;
      if(!this.rdpsDataAvail) {
        if ((isChrome = navigator.userAgent.indexOf("Chrome"))!=-1) {
            browserName = "Chrome";
            localStorage.setItem('browserName',browserName);
            //call service to get feature address
            this.liveLocServ.getFeatureAddress()
              .takeUntil(this.ngUnsubscribe)
              .subscribe((res: Array<FeatureAddress>) => {
              this.loginServ.setLoggedIn(true);
              this.loading = false;
              if(res.length > 0){
                // localStorage.setItem('featureAdrsAvailable', 'true');
                  let featureData:Array<any> = [];
                  res.map(data =>{
                    data.featureAddressDetail.map(result =>{
                    result.feature_image = result.feature_image.replace('~','');
                    featureData.push(result)
                    })
                  })
                  this.db = (<any>window).openDatabase('RDPS', '', 'RDPS data', 2 * 1024 * 1024)
                  this.db.transaction((txSync)=> {
                    try{
                      txSync.executeSql("CREATE TABLE RDPSTable (blockSection VARCHAR(50), distance VARCHAR(50), featureCode VARCHAR(50), featureDetail VARCHAR(50), feature_image VARCHAR(50), kiloMeter VARCHAR(50), latitude VARCHAR(50), longitude VARCHAR(50), section VARCHAR(50))", 
                                [], function(sqlTransaction, sqlResultSet) 
                      {
                        //console.log("Table has been created.");
                      });
                    }
                    catch(sqlException){
                      console.log('An error occured while creating a table'+sqlException);
                    }
                    if(featureData){
                      featureData.forEach((data)=> {
                        try{
                          txSync.executeSql("INSERT INTO RDPSTable(blockSection, distance, featureCode, featureDetail, feature_image, kiloMeter, latitude, longitude, section) VALUES (?,?,?,?,?,?,?,?,?)",
                          [data.blockSection, data.distance, data.featureCode, data.featureDetail, data.feature_image, data.kiloMeter, data.latitude, data.longitude, data.section],
                          (sqlTransaction, sqlResultSet) => {
                            // console.log(sqlResultSet.insertId+'record inserted');
                          })
                        }
                        catch(sqlException){
                          console.log('An error occured while inserting records'+sqlException);
                        }
                      })
                      
                    }  
                    localStorage.setItem('featureAdrsAvailable', 'true');
                  }); 
                  const dialogConfig = new MatDialogConfig();
                  //pass data to dialog
                  dialogConfig.data = {
                    hint: 'rdpsLoaded'
                  };
                  // dialogConfig.disableClose = true;
                  const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
              }
            },
            
            (error: any) =>{
              const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                hint: 'ServerError'
              };
              const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
            })
        } 
      }
      this.railwayUser = true;
      if(this.currUser.usrId != 534830){
        this.showSortByType = true;
      }
      this.rdpsDataAvail = JSON.parse(localStorage.getItem('featureAdrsAvailable'))
      if(this.browserName == "Chrome" &&  this.rdpsDataAvail){
        this.db = (<any>window).openDatabase('RDPS', '', 'RDPS data', 2 * 1024 * 1024)
      }
    }

// commented for USA map 24-feb-2021
    // if(this.USAUser){
    //   this.lat = 38.450362;
    //   this.lng = -76.895380;
    //   this.overspeedLimit = 65
    // }
    // else{
      this.lat = 20.593683;
      this.lng = 78.962883;
      if(this.currUser.accSqliteEnable == 0)
        this.overspeedLimit = 8
      else
        this.overspeedLimit = 50
    // }
  }

  getStyle(){
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.devicesList){
      if(this.devicesList.length == 1){
        this.showInfoCard = false;
        this.showAllbtn = false;
        let listShow = document.getElementsByClassName('hide-dev-list')[0] as HTMLElement;
        listShow.style.visibility = 'hidden';
      }
      if(this.devicesList.length>=10){
        let styles
        if(this.screenHeight < 768){
         styles = {
            'height': "84%",
            'margin-top': '0.5rem'
          };
        }
        else if(this.screenHeight == 600){
          styles = {
             'height': "80%",
             'margin-top': '0.5rem'
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

  setStyle(){
    let styles;
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.showSortByType){
      if(this.screenHeight > 1300){
        styles = {
          'height': "96vh"
        };
      }
      else if(this.screenHeight < 1300){
        styles = {
          'height': "80vh"
        };
      }
      else if(this.screenHeight < 768){
        styles = {
          'height': "75vh"
        };
      }
      /* else if(this.screenHeight < 500){
        styles = {
          'height': "60vh"
        };
      } */
    }
    else{
      styles = {
        'height': "98vh"
      };
    }
    return styles;
  }

  hideSeekDevList(){
    this.showDeviceList = !this.showDeviceList
  }

  private initIoConnection(): void{
    let webSocketUrl = 'ws://'+this.currUser.socketUrl+':'+environment.portNo+'/bullet';
    // let webSocketUrl = 'ws://123.252.246.214:8181/bullet';
    this.liveLocServ.initSocket(webSocketUrl);
  }

  sortByType(){
    this.devList = this.sortPipe.transform(this.devicesList,this.sortBy)
  }

  sortForAllLocation(){
    this.allLocations = this.allLocationPipe.transform(this.markers,this.SortForAllLocation)
  }

  getCurrentLocation(){
    this.liveLocServ.messages
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
      this.loading = true;
      this.liveTrack = JSON.parse(res.data);
      let speed = 0
      if(this.liveTrack.event == 'current_location'){
        this.selectedItem = this.selDevice;
        let latitude:number, longitude: number;
        if((this.liveTrack.data.lan_direction.includes('N') || this.liveTrack.data.lat_direction.includes('n'))
          && (this.liveTrack.data.lan_direction.includes('E') || this.liveTrack.data.lan_direction.includes('e')))
        {
          latitude = this.liveTrack.data.lat;
          longitude = this.liveTrack.data.lan;
        }
        else if((this.liveTrack.data.lat_direction.includes('N') || this.liveTrack.data.lat_direction.includes('n'))
          && (this.liveTrack.data.lan_direction.includes('W') || this.liveTrack.data.lan_direction.includes('w')))
          {
            latitude = this.liveTrack.data.lat;
            longitude = -this.liveTrack.data.lan;
          }
        else if((this.liveTrack.data.lat_direction.includes('S') || this.liveTrack.data.lat_direction.includes('s'))
          && (this.liveTrack.data.lan_direction.includes('E') || this.liveTrack.data.lan_direction.includes('e')))
          {
            latitude = -this.liveTrack.data.lat;
            longitude = this.liveTrack.data.lan;
          }
        else if((this.liveTrack.data.lat_direction.includes('S') || this.liveTrack.data.lat_direction.includes('s'))
          && (this.liveTrack.data.lan_direction.includes('W') || this.liveTrack.data.lan_direction.includes('w')))
          {
            latitude = -this.liveTrack.data.lat;
            longitude = -this.liveTrack.data.lan;
          }
        this.liveTrack.data.lan = longitude;
        this.liveTrack.data.lat = latitude;  
        let d: Date = new Date();
        let timeDiff = (parseInt(d.getTime()/1000+"")) - this.liveTrack.data.timestamp; 
        if(this.selDeviceType == 'Car'){
          if(this.liveTrack.data.speed > 0 && timeDiff<300){
            this.markerIcon = this.imagesUrl+'Green_Car.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }
          else if(this.liveTrack.data.speed == 0 && timeDiff<300){
            this.markerIcon = this.imagesUrl+'Blue_Car.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          } 
          else if(timeDiff>300){
            this.markerIcon = this.imagesUrl+'Red_Car.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }
        }
        else if(this.selDeviceType == 'Child'){
          var current = new Date();
          var Today_Time = this.datePipe.transform(current, 'yyyy-MM-dd 00:00')
          var todays_time: any = new Date(Today_Time).getTime()/1000;

          var yesterDay = new Date(current.getTime() - 86400000);
          var yes_time = this.datePipe.transform(yesterDay, 'yyyy-MM-dd 00:00')
          this.yesterTimestamp = new Date(yes_time).getTime()/1000;

          // current on device marker
          if(this.liveTrack.data.timestamp > todays_time && timeDiff < 300){
            // this.markerIcon = this.imagesUrl+'GreenTracker_marker.svg';
            this.markerIcon = '../assets/GreenTracker_marker.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }
          // today's on device marker
          else if(this.liveTrack.data.timestamp > todays_time){
            // this.markerIcon = this.imagesUrl+'GreenTracker_marker.svg';
            this.markerIcon = '../assets/orangeTracker_Marker.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }

          // today's off device marker
          else if(this.liveTrack.data.timestamp > this.yesterTimestamp && this.liveTrack.data.timestamp <= todays_time){
            // this.markerIcon = this.imagesUrl+'GreenTracker_marker.svg';
            this.markerIcon = '../assets/RedTracker_marker.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }

          // past off device marker
          else if (this.liveTrack.data.timestamp < this.yesterTimestamp) {
            // this.markerIcon = this.imagesUrl+'Red_marker.svg';
            this.markerIcon = '../assets/grayTracker_marker.svg';
            if(this.marker != undefined){
              let icon = this.marker.getIcon();
              icon.url = this.markerIcon
              this.marker.setIcon(icon)
            }
          }
        }
        else{
          this.markerIcon = '../assets/ic_markerboy.png'
          if(this.marker != undefined){
            let icon = this.marker.getIcon();
            icon.url = this.markerIcon
            this.marker.setIcon(icon)
          }
        }
        this.liveLocation.push(this.liveTrack)
        this.map.setCenter({lat: this.liveTrack.data.lat, lng: this.liveTrack.data.lan});
        this.zoomLevel = 16;
        this.markers = [];
        this.allLocations = [];
        this.sortedFeatureAdrs = [];
        if(this.selDeviceType == 'Child' || this.selDeviceType == 'Car' || this.selDeviceType == 'Pet'){
          this.batteryLevel = this.liveTrack.data.voltage_level+''
          this.gsmSignalLevel = this.liveTrack.data.gsm_signal_strength+''
          //To show battery status
          switch(this.batteryLevel){
            case '1': {
              this.batteryImage = '../../assets/images/battery_alert.svg'
              break;
            }
            case '2': {
              this.batteryImage = '../../assets/images/battery_20.svg'
              break;
            }
            case '3': {
              this.batteryImage = '../../assets/images/battery_50.svg'
              break;
            }
            case '4': {
              this.batteryImage = '../../assets/images/battery_80.svg'
              break;
            }
            case '5': {
              this.batteryImage = '../../assets/images/battery_90.svg'
              break;
            }
            case '6': {
              this.batteryImage = '../../assets/images/battery_full.svg'
              break;
            }
            case 'data_not_found': {
              this.batteryLevel = ''
              break;
            }
            default:{
              this.batteryLevel = ''
            }
          }
          //To show gsm signal strength
          switch(this.gsmSignalLevel){
            case '0': {
              this.gsmSignalImage = '../assets/images/cellular_0.svg'
              break;
            }
            case '1': {
              this.gsmSignalImage = '../assets/images/cellular_1.svg'
              break;
            }
            case '2': {
              this.gsmSignalImage = '../assets/images/cellular_2.svg'
              break;
            }
            case '3': {
              this.gsmSignalImage = '../assets/images/cellular_3.svg'
              break;
            }
            case '4': {
              this.gsmSignalImage = '../assets/images/cellular_4.svg'
              break;
            }
            case 'data_not_found': {
              this.gsmSignalLevel = ''
              break;
            }
            default:{
              this.gsmSignalLevel = ''
            }
          }
        }
        else{
          this.batteryLevel = ''
          this.gsmSignalLevel = ''
        }
        //For getting RDPS data
        if(this.currUser.accSqliteEnable == 0){
          if(this.browserName == "Chrome" && this.rdpsDataAvail){  
          this.getFeatureAddressSignal().then(
            (res:any) => {
              
              for(let i=0; i< res.rows.length; i++){
                this.sortedFeatureAdrs.push(res.rows[i])
              }
              if(res.rows.length>0){
                this.showFeatureAddress = true;
                this.smallestDistance = this.distancePole({lat: this.liveTrack.data.lat, lng: this.liveTrack.data.lan},res.rows)
                if(this.showGoogleAddress == "1"){
                  this.locationKmPole = ""+(+res.rows[this.smallestDistance.position].kiloMeter + ((+res.rows[this.smallestDistance.position].distance + 
                                        this.smallestDistance.minDist)*0.001)).toFixed(4)
                  this.smallDistance = this.smallestDistance.minDist.toFixed(3) + " meter from " + res.rows[this.smallestDistance.position].featureDetail;                     
                }
                else{
                  this.smallDistance = this.smallestDistance.minDist.toFixed(3) + " meter from " + res.rows[this.smallestDistance.position].featureDetail;
                }
              }
            },
            (err) => console.error(err)
          )}
        } 
        // if(this.currUser.accSqliteEnable != 0){
          //  this.getAddress(this.liveTrack.data.lat, this.liveTrack.data.lan)
        // } 
        this.selectedDevice = this.selDevice
        // commented speed for USA user 24-feb-2021
        // if(this.USAUser){
        //   this.currSpeed = +(this.liveTrack.data.speed*0.621371).toFixed(2);
        // }
        // else
          this.currSpeed = this.liveTrack.data.speed;
        this.currDate = this.liveTrack.data.timestamp*1000;
        this.showInfoCard = false;
        if(this.screenWidth>500)
          this.showLiveLocation = true;
        else
          this.showLiveLocation = false;
        if(this.liveLocation.length > 1){
          if(this.currUser.accSqliteEnable == 0){
            this.loading = false;
            this.currLocation.push({
                lat:this.liveTrack.data.lat,
                lng:this.liveTrack.data.lan,
                speed: this.liveTrack.data.speed,
                timestamp: this.liveTrack.data.timestamp,
                icon:  {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 3,
                  fillColor: "#0282FB",
                  fillOpacity: 1,
                  strokeWeight: 1,
                  anchor: new google.maps.Point(0, 5),
                  rotation: 0,
                  zIndex: 0
                }
              })
              let newPosition1 = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan);
              this.marker.setPosition(newPosition1);
              this.setInfoWindow()
              let loc1 = new google.maps.LatLng(this.liveLocation[this.liveLocation.length-2].data.lat, this.liveLocation[this.liveLocation.length-2].data.lan)
              let loc2 = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan)
              //to set bearing to live location marker of arrow to railway users
              let bearing = this.bearingBetweenLocations(loc1, loc2);
              this.currLocation[this.currLocation.length-1].icon.rotation = bearing;
             /*  if(this.markerIcon !== null && this.markerIcon.includes('Green_marker.svg')){
                const node = document.querySelector('[src="http://mykiddytracker.com:81/Images/Green_marker.svg"]') as HTMLElement;
                if(node != null)
                  node.style.transform = 'rotate(' + bearing + 'deg)';
              } */
              /* this.marker.icon.rotation = bearing;
              this.marker.setIcon(this.marker.icon) */
          }
          else{
              if((this.liveTrack.data.speed > 0 && timeDiff<300)){
                this.getSnapToRoad(this.liveLocation[this.liveLocation.length-2],this.liveTrack)
                this.setInfoWindow()
              }
              else if(this.liveTrack.data.speed == 0 && timeDiff<300){
                let newLoc = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan);
                this.marker.setPosition(newLoc);
                this.setInfoWindow()
              }
              this.loading = false;   
          }
        }
        if(this.liveLocation.length == 1){
          if(this.currUser.accSqliteEnable == 0){
            this.currLocation.push({
              lat: this.liveTrack.data.lat,
              lng: this.liveTrack.data.lan, 
              speed: this.liveTrack.data.speed,
              timestamp: this.liveTrack.data.timestamp,
              icon:  {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 3,
                fillColor: "#0282FB",
                fillOpacity: 1,
                strokeWeight: 1,
                anchor: new google.maps.Point(0, 5),
                rotation: 0,
                zIndex: 0
              }
            })
          }
          else{
            // commented on 24-feb-2021
            // if(this.USAUser)
            //   speed = +(this.liveTrack.data.speed*0.621371).toFixed(2)
            // else
              speed = this.liveTrack.data.speed
            this.currLocation.push({
              lat: this.liveTrack.data.lat,
              lng: this.liveTrack.data.lan, 
              speed: speed,
              timestamp: this.liveTrack.data.timestamp,
              icon:  {
                url: this.iconUrl,
                rotation: 0
              }
            })
          }
          // if marker exists and has a .setMap method, hide it
          if (this.marker && this.marker.setMap) {
            this.marker.setMap(null);
          }
          let myLatlng = new google.maps.LatLng(this.liveTrack.data.lat, this.liveTrack.data.lan)
          this.marker = new SlidingMarker({
            position: myLatlng,
            map: this.map,
            title: "Device",
            duration: 1200,
            easing: "easeOutExpo",
            icon:  {
              url: this.markerIcon,
              rotation: 0
            /*   path: this.car,
              scale: .7,
              strokeColor: 'white',
              strokeWeight: .10,
              fillOpacity: 1,
              fillColor: 'blue',
              rotation: 0 */
            }
          });
          this.setInfoWindow()
          this.loading = false;
          if(timeDiff>300){
            let input ={
              "event": "stop_track"
            }
            this.liveLocServ.sendMsg(input)
          }
        }
        
      }
      else if(this.liveTrack.event == "error" && this.liveTrack.data.error_msg == "device_id_not_found"){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              devName: this.selDevice,
              hint: 'DeviceNotRegister'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      } 
      else if(this.liveTrack.event == "device_packet_on_server") {
        this.loading = false;
      }
      else{
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              devName: this.selDevice,
              hint: 'liveLocationNotFound'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    },(err) => {
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        devName: this.selDevice,
        hint: 'NoInternetConnection'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    })
  }

  setInfoWindow() {
    let $event;
    var unit, speed;
      unit = ' Km/hr'
      speed = this.liveTrack.data.speed
    // }
    if(this.currUser.accSqliteEnable == 0)
      $event = 'mouseover'
    else
      $event = 'click'
    google.maps.event.addListener(this.marker,  $event, () => {
        let iwindow = new google.maps.InfoWindow();
        if(this.showGoogleAddress == "1" && this.currUser.accSqliteEnable == 0){
          iwindow.setContent('<div class="info-bubble" style="border-radius:5px;max-width:300px;font-weight:500;">'+
                           '<b style="color: Blue">Name: </b>' + this.selDevice + ' <b style="color: Blue">Speed:</b> '+this.liveTrack.data.speed+' Km/hr'+
                           '<b style="color: Blue"> Date & Time: </b>'+this.datePipe.transform(this.liveTrack.data.timestamp*1000, "MMM d, y HH:mm")+
                           '<b style="color: Blue"> Location: </b>'+this.locationKmPole+'Km <b style="color: Blue"> Distance: </b>'+this.smallDistance+'</div>');
        }
        else if(this.showGoogleAddress == "0" && this.currUser.accSqliteEnable == 0 && this.showFeatureAddress == true){
          iwindow.setContent('<div class="info-bubble" style="border-radius:5px;max-width:300px;font-weight:500;">'+
                           '<b style="color: Blue">Name: </b>' + this.selDevice + ' <b style="color: Blue">Speed:</b> '+this.liveTrack.data.speed+' Km/hr'+
                           '<b style="color: Blue"> Date & Time: </b>'+this.datePipe.transform(this.liveTrack.data.timestamp*1000, "MMM d, y HH:mm")+
                          //  '<b style="color: Blue"> Address: </b>'+this.currAddress+
                           '<b style="color: Blue"> Distance: </b>'+this.smallDistance+'</div>');
        }
        else if(this.currUser.accSqliteEnable == 1 && this.liveTrack.data.speed > 0){
        iwindow.setContent('<div class="info-bubble" style="border-radius:5px;max-width:300px;font-weight:500;">'+
                           '<b style="color: Blue">Name: </b>' + this.selDevice + ' <b style="color: Blue">Speed:</b> '+speed+unit+
                           '<b style="color: Blue"> Date & Time: </b>'+this.datePipe.transform(this.liveTrack.data.timestamp*1000, "MMM d, y HH:mm")+
                           '<b style="color: Blue"> Address: </b>'+this.currAddress+'</div>');
        }
        else {
          iwindow.setContent('<div class="info-bubble" style="border-radius:5px;max-width:300px;font-weight:500;">'+
                             '<b style="color: Blue">Name: </b>' + this.selDevice + ' <b style="color: Blue">Speed:</b> '+speed+unit+
                             '<b style="color: Blue"> Date & Time: </b>'+this.datePipe.transform(this.liveTrack.data.timestamp*1000, "MMM d, y HH:mm")+
                             '<b style="color: Blue"> Address: </b>'+this.currAddress+'</div>');
          }
        iwindow.open(this.map, this.marker);
        google.maps.event.addListener(this.marker, 'mouseout', () => {
          iwindow.close();
        });
    });
  }

  public distancePole (L1 :any, featurelist: Array<any> )
  {
    let earthRadius = 3958.75;
    let minDistance = 0;
    let position = 0;
    let meterConversion = 1609;
    for (let i=0;i<featurelist.length;i++){
        let L2 = {lat: featurelist[i].latitude, lng: featurelist[i].longitude};
        let latDiff = this.deg2rad(L2.lat) - this.deg2rad(L1.lat);
        let lngDiff = this.deg2rad(L2.lng) - this.deg2rad(L1.lng);
        let a = Math.sin(latDiff /2) * Math.sin(latDiff /2) +
                Math.cos(this.deg2rad(L1.lat)) * Math.cos(this.deg2rad(L2.lat)) *
                        Math.sin(lngDiff /2) * Math.sin(lngDiff /2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let distance = earthRadius * c;

        if (i==0)
            minDistance=distance;
        else if (distance<minDistance)
        {
            minDistance=distance;
            position=i;
        } 
    }
    return {minDist: (minDistance * meterConversion), position: position} ;
  }

  private deg2rad(deg) {
    return (deg * Math.PI / 180.0);
}

  getFeatureAddressSignal(): Promise<Array<any>> {
    let queryStatement:string;
    if(this.currUser.usrId == 534830){
      queryStatement = "Select * from RDPSTable where" +
      " latitude != 0  and latitude between " +(this.liveTrack.data.lat - 0.020)
      +" and "+(this.liveTrack.data.lat + 0.020)  +" and longitude between" +
      " "+(this.liveTrack.data.lan  - 0.020)+" and "+(this.liveTrack.data.lan  + 0.020)
      +" order by abs("+this.liveTrack.data.lan + " - latitude) " +
      "+ abs("+this.liveTrack.data.lan +" - longitude)"
    }
    else{
      queryStatement = "Select * from RDPSTable where" +
        " latitude != 0  and latitude between " +(this.liveTrack.data.lat - 0.20)
        +" and "+(this.liveTrack.data.lat + 0.20)  +" and longitude between" +
        " "+(this.liveTrack.data.lan  - 0.20)+" and "+(this.liveTrack.data.lan  + 0.20)
        +" order by abs("+this.liveTrack.data.lan + " - latitude) " +
        "+ abs("+this.liveTrack.data.lan +" - longitude)"
    }
    // console.log("queryStatement", queryStatement)
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(queryStatement, [],
          (tx, result) => {
            resolve(result)
          },
          (error) => reject(error));
          // console.log("tx", tx)
      });
      // console.log("this.db", this.db)
    })
  }

  getKmLocation(feature){
    return parseInt(feature.kiloMeter) + parseInt(feature.distance)*0.001
  }

  getSnapToRoad(location1: LocationInfo,location2: LocationInfo){
    let loc1 = new google.maps.LatLng(location1.data.lat, location1.data.lan)
    let loc2 = new google.maps.LatLng(location2.data.lat, location2.data.lan)
    let speed;
    this.liveLocServ.getSnapToRoad(loc1,loc2)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: any) =>{
        if(data.snappedPoints.length == 0){
          return
        }
        else{ 
          for (let i = 0; i < data.snappedPoints.length; i++) {
            let lat = data.snappedPoints[i].location.latitude
            let lng = data.snappedPoints[i].location.longitude

            // commented speed for USA user 24-feb-2021
            // if(this.USAUser)
            //   speed = +(location1.data.speed*0.621371).toFixed(2)
            // else
              speed = location1.data.speed
            let timestamp = location1.data.timestamp
            let bearing = this.bearingBetweenLocations(loc1, loc2);
            this.currLocation.push({lat:lat, lng:lng, speed: speed, timestamp: timestamp,
              icon:  {
                url: this.iconUrl,
                rotation: 0
              }
            })
            let newPosition1 = new google.maps.LatLng(lat, lng);
            this.marker.setPosition(newPosition1);
            if(this.markerIcon.includes('Green_Car.svg')){
              const node = document.querySelector('[src="http://mykiddytracker.com:81/Images/Green_Car.svg"]') as HTMLElement;
              node.style.transform = 'rotate(' + bearing + 'deg)';
            }
           /*  this.marker.icon.rotation = bearing;
            this.marker.setIcon(this.marker.icon) */
          }
        }
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

  public getAllDeviceLocation(){
    this.loading = true;
    this.markers = [];
    this.allLocations = [];
    this.showBeatBtn = true;
    let lat, lng, speed, dateTimestamp, timeDiff: number;
    let devName: string;
    let icon: string;
    let std_id: any;
    let stdType: any;
    let input = {
      "event": "stop_track"
    } 
    this.liveLocServ.sendMsg(input);
    this.liveLocation = [];
    this.currLocation = [];
    this.sortedFeatureAdrs = [];
    this.showFeatureAddress = false;
    this.showLiveLocation = false;
    this.zoomLevel = 5;
    if (this.marker && this.marker.setMap) {
      this.marker.setMap(null);
    }
    this.selectedItem = '';
      this.getDevice.getAllDeviceLocation(this.currUser.usrId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((data: Array<AllDevicesLocation>) => {
          this.allDevicesLocation.push(data)
          this.totalDevices = data.length; 
          if(data.length==0){
            this.loading =false;
            const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'locationNotFound'
            };
            const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
          }
          else{
            this.onDeviceCnt = 0;
            this.offDeviceCnt = 0;
            this.stoppageDevCnt = 0;
            this.pastOffDeviceCount = 0;
            this.todayOnDeviceCnt = 0;
            let d: Date = new Date();
            let device: DevicesInfo;
            this.devList = [];
            this.SortForAllLocation = 'all';
            this.sortBy = 'All'
            var current = new Date();
            var Today_Time = this.datePipe.transform(current, 'yyyy-MM-dd 00:00')
            var todays_time: any = new Date(Today_Time).getTime()/1000;

            var yesterDay = new Date(current.getTime() - 86400000);
            var yes_time = this.datePipe.transform(yesterDay, 'yyyy-MM-dd 00:00')
            this.yesterTimestamp = new Date(yes_time).getTime()/1000;
            //let deviceNames: Array<DevicesInfo> = [];
            data.forEach(res => {
                timeDiff = (parseInt(d.getTime()/1000+"")) - +res.timestamp;
                this.devicesList.forEach(dev => {
                  if(dev.name == res.name){
                    device = dev
                  }
                })
                if(res.type == 'Child'){

                  // today's off device
                  if (res.timestamp > this.yesterTimestamp && res.timestamp <= todays_time ) {
                    this.offDeviceCnt++;
                    icon = '../assets/red-marker.png';
                    device.liveStatusImg = '../assets/liveStatusOff.svg';
                  }

                  // past off devices
                  else if(res.timestamp < this.yesterTimestamp) {
                    this.pastOffDeviceCount++;
                    icon = '../assets/gray-marker.png';
                    device.liveStatusImg = '../assets/liveStatusExpire.svg';
                  }
                  // today's on devices
                  else if(res.timestamp > todays_time) {
                    this.todayOnDeviceCnt++;
                    icon = '../assets/orange-marker.png';
                    device.liveStatusImg = '../assets/orangeStatus.svg';

                    //  current on devices
                      if (res.timestamp > todays_time && timeDiff < 300) {
                        this.onDeviceCnt++;
                        icon = '../assets/darkGreen-marker.png';
                        device.liveStatusImg = '../assets/liveStatusOn.svg';
                      }
                  }
                  else{
                    device.liveStatusImg = '../assets/liveStatusExpire.svg';
                  }
                }
                else if(res.type == 'Car'){
                  //timeDiff is compared with 300seconds due to 5 mins interval
                    if(+res.speed > 0 && timeDiff<300){
                      icon = '../assets/GreenCar.png';
                      this.onDeviceCnt++;
                      device.liveStatusImg = '../assets/liveStatusOn.svg';
                    }
                    else if(+res.speed == 0 && timeDiff<300){
                      icon = '../assets/BlueCar.png';
                      this.stoppageDevCnt++;
                      device.liveStatusImg = '../assets/liveStatusStoppage.svg';
                    }
                    else if(timeDiff>300){
                      icon = '../assets/RedCar.png';
                      this.offDeviceCnt++;
                      device.liveStatusImg = '../assets/liveStatusOff.svg';
                    }
                    else{
                      device.liveStatusImg = '../assets/liveStatusExpire.svg';
                    }
                }
                else if(res.type == 'Pet'){
                  icon = '../assets/RedCar.png';
                  device.liveStatusImg = '../assets/liveStatusOff.svg';
                }

                // commented on 24-feb-2021
                // if(this.USAUser)
                //   speed = (+res.speed*0.621371).toFixed(2)
                // else
                  speed = parseInt(res.speed);
                dateTimestamp = parseInt(res.timestamp);
                devName = res.name;
                std_id = res.student_id;
                stdType = res.type;
                lat = +res.lat;
                lng= +res.lan;
                
                this.markers.push({
                  lat,
                  lng,
                  speed,
                  dateTimestamp,
                  devName,
                  std_id,
                  stdType,
                  icon
                })
              this.allLocations = this.markers;               
              this.devList.push(device)
          })
            this.devicesList = this.devList
            if(this.currUser.accSqliteEnable == 0){
              //this.offDeviceCnt = this.totalDevices - this.onDeviceCnt;
              this.loading =false;
              this.showInfoCard = true;
            }
            else{
              this.showStoppageDevices = true;
              this.loading = false;
              this.showInfoCard = true;
            }
            if(this.markers.length>20){
              this.showCluster = true;
            }
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

  fetchAddress(lat, lng){
    this.reportServ.getAddress(lat, lng)
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

  getAddress(lat:number, lng:number){
    this.currAddress = ' ';
    this.showCurrAddress = true;
    this.reportServ.getAddress(lat, lng)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: any) => {
          if(data.results[0]){
            this.currAddress = data.results[0].formatted_address;
          }
          else{
            this.currAddress = "Address not found";
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

  getDevices(){
      this.loading = true;
      this.getDevice.getAllDeviceList(this.currUser.usrId)
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
            localStorage.setItem('devicesList',JSON.stringify(data))
            this.devicesList = JSON.parse(localStorage.getItem('devicesList'))
            this.devList = this.devicesList
            this.userType = this.devicesList[0].type
            localStorage.setItem('userType',this.devicesList[0].type)
            if(this.devicesList.length>10){
              this.showSearchText = true;
              localStorage.setItem('showSearchText', this.showSearchText.toString())
            }
            this.loading = false;
            //fetch live location
            this.getCurrentLocation();
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

  public sendInfo(devName:string,stud_id: number,chkExpiry,devType: string,showGoogleAdrs: string): void {
    this.showBeatBtn = false;
    this.selectedDeviceSId = stud_id;
    this.selDeviceType = devType;
    this.showCurrAddress = false;
    this.showGoogleAddress = showGoogleAdrs;
    if(chkExpiry>=0){
      if (!stud_id) {
        return;
      }
      let input = {
        "event": "stop_track"
      } 
      this.liveLocServ.sendMsg(input);
      this.currLocation = [];
      this.liveLocation = [];
      let inputData =  {
        "event":"start_track",
        "student_id": +stud_id
      };
      this.liveLocServ.sendMsg(inputData);
      this.selDevice = devName;
    }
    else{
      const dialogConfig = new MatDialogConfig();
              //pass data to dialog
              dialogConfig.data = {
                devName: devName,
                hint: 'SubscriptionExpire'
              };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    }
  }

 
  getBeatInfo() {
  // this.loading = true;
    const dialogConfig = new MatDialogConfig();
    this.historyServ.getBeatInfoOfDevices(this.selectedDeviceSId).
    subscribe((res)=> {
      dialogConfig.width = '400px';
      dialogConfig.height = '280px';
      dialogConfig.data = res;
      dialogConfig.position = { right: 7 + '%', top: 10 + '%' }

      let dialogRef = this.dialog.open(BeatInfoDialogComponent, dialogConfig)
      .afterClosed().subscribe((result) => { 
      })
    })
  }

  public getTrackingInfo(devName:string,stud_id: number,devType: string): void {
   this.selDeviceType = devType;
      let input = {
        "event": "stop_track"
      } 
      this.liveLocServ.sendMsg(input);
      this.currLocation = [];
      this.liveLocation = [];
      let inputData =  {
        "event":"start_track",
        "student_id": +stud_id
      };
      this.liveLocServ.sendMsg(inputData);
      this.selDevice = devName;
  }

  ngOnDestroy(): void{
    this.wsServ.closeConnection()
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}


