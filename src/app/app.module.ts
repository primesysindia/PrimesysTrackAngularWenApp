import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './core/material.module';
import { AppRoutingModule } from './core/app.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { HistoryComponent } from './history/history.component';
import { ReportComponent } from './report/report.component';
import { PaymentComponent } from './payment/payment.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { GetDeviceService } from './services/get-device.service';
import { ScrollbarModule } from 'ngx-scrollbar';
import { FindDevicePipe } from './filters/find-device.pipe';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { WebsocketService } from './services/websocket.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { GetHistoryService } from './services/get-history.service';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ModuleListService } from './services/module-list.service';
import { ReportService } from './services/report.service';
import { TripReportComponent } from './report/trip-report/trip-report.component';
import { ExcelService } from './services/excel.service';
import { DatePipe } from '@angular/common';
import { CurrentStatusComponent } from './report/current-status/current-status.component';
import { OffDeviceComponent } from './report/off-device/off-device.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SortDevicesPipe } from './filters/sort-devices.pipe';
import { PaymentService } from './services/payment.service';
import { FeedbackService } from './services/feedback.service';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { DownloadTaskComponent } from './download-task/download-task.component';
import { AddEmpComponent } from './manage-employee/add-emp/add-emp.component';
import { TaskManagementService } from './services/task-management.service';
import { OfflineComponent } from './offline/offline.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderModule } from 'ngx-order-pipe';
import { SearchDevicePipe } from './filters/search-device.pipe';
import { AllLocationPipe } from './filters/all-location.pipe';
import { UserDataService } from './services/user-data.service';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { UpdateTaskDialogComponent } from './dialog/update-task-dialog/update-task-dialog.component';
import { CopyTaskViewDialogComponent } from './dialog/copy-task-view-dialog/copy-task-view-dialog.component';
import { ReplaceUnderscorePipe } from './filters/replace-underscore.pipe';
import { MatSelectSearchComponent } from './mat-select-search/mat-select-search.component';
import { SearchFileNamePipe } from './filters/search-file-name.pipe';
import { IssueLoggingComponent } from './issue-logging/issue-logging.component';
import { IssueLoggingService } from './services/issue-logging.service';
import { IssueHistoryComponent } from './issue-history/issue-history.component';
import { ReportFilterPipe } from './filters/report-filter.pipe';
// import { DemoRdpsComponent } from './demo-rdps/demo-rdps.component';
import { PatrolmanFilterPipe } from './filters/patrolman-filter.pipe';
import { PatrolmanSummaryDetailComponent } from './report/patrolman-summary-detail/patrolman-summary-detail.component';
import { PatrolmenBeatUpdateComponent } from './patrolmen-beat-update/patrolmen-beat-update.component';
import { ArrowDivDirective } from './services/arrow-div.directive';
import { AddTripMasterComponent } from './add-trip-master/add-trip-master.component';
import { SerachNameRemarkPipe } from './filters/serach-name-remark.pipe';
import { KeymenBeatUpdateComponent } from './keymen-beat-update/keymen-beat-update.component';
import { KeymenBeatStatusComponent } from './beat-module/keymen-beat-status/keymen-beat-status.component';
import { ConfirmDialogComponent } from './beat-module/confirm-dialog/confirm-dialog.component';
import { BeatInfoDialogComponent } from './beat-info-dialog/beat-info-dialog.component';
import { UsernameDialogComponent } from './beat-module/username-dialog/username-dialog.component';
import { PatrolmenConfirmDialogComponent } from './beat-module/patrolmen-confirm-dialog/patrolmen-confirm-dialog.component';
import { PateolmenBeatStatusComponent } from './beat-module/pateolmen-beat-status/pateolmen-beat-status.component';
import { PateolmenUsernameDialogComponent } from './beat-module/pateolmen-username-dialog/pateolmen-username-dialog.component';
import { AllKeymenExistingBeatComponent } from './beat-module/all-keymen-existing-beat/all-keymen-existing-beat.component';
import { UtilityModuleComponent } from './utility-module/utility-module.component';
import { PatrolmenSingleBeatComponent } from './patrolmen-single-beat/patrolmen-single-beat.component';
import { AllKeymenExistingBeatsComponent } from './beat-module/all-keymen-existing-beats/all-keymen-existing-beats.component';
import { BeatExcelService } from './services/beat-excel.service';
import { PdfServiceService } from './services/pdf-service.service';
import { FormDirective } from './form.directive';
import { KeymenVideoLinkComponent } from './beat-module/keymen-video-link/keymen-video-link.component';
import { AllPatrolmenExistingBeatsComponent } from './beat-module/all-patrolmen-existing-beats/all-patrolmen-existing-beats.component';
import { AllVideosPageComponent } from './all-videos-page/all-videos-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AppHeaderComponent,
    HistoryComponent,
    ReportComponent,
    PaymentComponent,
    FeedbackComponent,
    AppFooterComponent,
    FindDevicePipe,
    TripReportComponent,
    CurrentStatusComponent,
    OffDeviceComponent,
    SortDevicesPipe,
    ManageEmployeeComponent,
    DownloadTaskComponent,
    AddEmpComponent,
    OfflineComponent,
    SearchDevicePipe,
    AllLocationPipe,
    AddTaskComponent,
    ViewTaskComponent,
    UpdateTaskDialogComponent,
    CopyTaskViewDialogComponent,
    ReplaceUnderscorePipe,
    MatSelectSearchComponent,
    SearchFileNamePipe,
    IssueLoggingComponent,
    IssueHistoryComponent,
    ReportFilterPipe,
    // DemoRdpsComponent,
    PatrolmanFilterPipe,
    PatrolmanSummaryDetailComponent,
    PatrolmenBeatUpdateComponent,
    ArrowDivDirective,
    AddTripMasterComponent,
    SerachNameRemarkPipe,
    KeymenBeatUpdateComponent,
    KeymenBeatStatusComponent,
    ConfirmDialogComponent,
    BeatInfoDialogComponent,
    UsernameDialogComponent,
    PatrolmenConfirmDialogComponent,
    PateolmenBeatStatusComponent,
    PateolmenUsernameDialogComponent,
    AllKeymenExistingBeatComponent,
    UtilityModuleComponent,
    PatrolmenSingleBeatComponent,
    AllKeymenExistingBeatsComponent,
    FormDirective,
    KeymenVideoLinkComponent,
    AllPatrolmenExistingBeatsComponent,
    AllVideosPageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCfxl6zY8sJMW-pVsmwYClRPyfxWkQb8us'
    }),
    AgmJsMarkerClustererModule,
    NgxLoadingModule.forRoot({}),
    AgmSnazzyInfoWindowModule,
    ScrollbarModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    ChartsModule,
    SlimLoadingBarModule,
    NgSelectModule,
    OrderModule,
    // ToastrModule.forRoot()
  ],
  providers: [
    LoginService,
    UserDataService,
    AuthGuard,
    GetDeviceService,
    WebsocketService,
    GetHistoryService,
    ModuleListService,
    ReportService,
    ExcelService,
    DatePipe,
    GoogleMapsAPIWrapper,
    PaymentService,
    FeedbackService,
    TaskManagementService,
    IssueLoggingService,
    BeatExcelService,
    PdfServiceService
  ],
  entryComponents: [
    UpdateTaskDialogComponent,
    CopyTaskViewDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
