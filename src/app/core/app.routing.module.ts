import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { AuthGuard } from '../auth.guard';
import { HistoryComponent } from '../history/history.component';
import { ReportComponent } from '../report/report.component';
import { PaymentComponent } from '../payment/payment.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { ManageEmployeeComponent } from '../manage-employee/manage-employee.component';
import { DownloadTaskComponent } from '../download-task/download-task.component';
import { OfflineComponent } from '../offline/offline.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { IssueLoggingComponent } from '../issue-logging/issue-logging.component';
import { IssueHistoryComponent } from '../issue-history/issue-history.component';
// import { DemoRdpsComponent } from '../demo-rdps/demo-rdps.component';
import { PatrolmanSummaryDetailComponent } from '../report/patrolman-summary-detail/patrolman-summary-detail.component';
import { PatrolmenBeatUpdateComponent } from '../patrolmen-beat-update/patrolmen-beat-update.component';
import { AddTripMasterComponent } from '../add-trip-master/add-trip-master.component';
import { KeymenBeatUpdateComponent } from '../keymen-beat-update/keymen-beat-update.component';
import { KeymenBeatStatusComponent } from '../beat-module/keymen-beat-status/keymen-beat-status.component';
import { ConfirmDialogComponent } from '../beat-module/confirm-dialog/confirm-dialog.component';
import { BeatInfoDialogComponent } from '../beat-info-dialog/beat-info-dialog.component';
import { UsernameDialogComponent } from '../beat-module/username-dialog/username-dialog.component';
import { PatrolmenConfirmDialogComponent } from '../beat-module/patrolmen-confirm-dialog/patrolmen-confirm-dialog.component';
import { PateolmenBeatStatusComponent } from '../beat-module/pateolmen-beat-status/pateolmen-beat-status.component';
import { PateolmenUsernameDialogComponent } from '../beat-module/pateolmen-username-dialog/pateolmen-username-dialog.component';
import { AllKeymenExistingBeatComponent } from '../beat-module/all-keymen-existing-beat/all-keymen-existing-beat.component';
import { UtilityModuleComponent } from '../utility-module/utility-module.component';
import { PatrolmenSingleBeatComponent } from '../patrolmen-single-beat/patrolmen-single-beat.component';
import { AllKeymenExistingBeatsComponent } from '../beat-module/all-keymen-existing-beats/all-keymen-existing-beats.component';
import { KeymenVideoLinkComponent } from '../beat-module/keymen-video-link/keymen-video-link.component';
import { AllPatrolmenExistingBeatsComponent } from '../beat-module/all-patrolmen-existing-beats/all-patrolmen-existing-beats.component';
import { AllVideosPageComponent } from '../all-videos-page/all-videos-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate:[AuthGuard] },
  { path: 'report', component: ReportComponent, canActivate:[AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate:[AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate:[AuthGuard] },
  { path: 'manage-employee', component: ManageEmployeeComponent, canActivate:[AuthGuard] },
  { path: 'add-task', component: AddTaskComponent, canActivate:[AuthGuard] },
  { path: 'tasks', component: ViewTaskComponent, canActivate:[AuthGuard] },
  { path: 'download-task', component: DownloadTaskComponent, canActivate:[AuthGuard] },
  { path: 'issue-logging', component: IssueLoggingComponent, canActivate:[AuthGuard] },
  { path: 'issue-history', component: IssueHistoryComponent, canActivate:[AuthGuard] },
  { path: 'summary-details', component: PatrolmanSummaryDetailComponent, canActivate:[AuthGuard] },
  { path: 'trip-master', component: AddTripMasterComponent, canActivate:[AuthGuard] },
  { path: 'patrolmen-beat', component: PatrolmenBeatUpdateComponent, canActivate:[AuthGuard] },
  { path: 'keymen-beat-update', component: KeymenBeatUpdateComponent, canActivate:[AuthGuard] },
  { path: 'keymen-beat-status', component: KeymenBeatStatusComponent, canActivate:[AuthGuard] },
  { path: 'confirm-dialog-box', component: ConfirmDialogComponent, canActivate:[AuthGuard] },
  { path: 'beat-info-dialog', component: BeatInfoDialogComponent, canActivate:[AuthGuard] },
  { path: 'user-dialog', component: UsernameDialogComponent, canActivate:[AuthGuard] },
  { path: 'patrolmen-confirm-dialog', component: PatrolmenConfirmDialogComponent, canActivate:[AuthGuard] },
  { path: 'patrolmen-beat-status', component: PateolmenBeatStatusComponent, canActivate:[AuthGuard] },
  { path: 'patrolmen-user-dialog', component: PateolmenUsernameDialogComponent, canActivate:[AuthGuard] },
  { path: 'keymen-beats', component: AllKeymenExistingBeatComponent, canActivate:[AuthGuard] },
  { path: 'utility-module', component: UtilityModuleComponent, canActivate:[AuthGuard] },
  { path: 'patrolmen-single-beat', component: PatrolmenSingleBeatComponent, canActivate:[AuthGuard] },
  { path: 'all-keymen-beats', component: AllKeymenExistingBeatsComponent, canActivate:[AuthGuard] },
  { path: 'all-patrolmen-beat', component: AllPatrolmenExistingBeatsComponent, canActivate:[AuthGuard] },
  { path: 'keymen-demo', component: KeymenVideoLinkComponent, canActivate:[AuthGuard] },
  { path: 'demo-videos', component: AllVideosPageComponent, canActivate:[AuthGuard] },
  { path: 'offline', component: OfflineComponent},
  { path: '', component : LoginComponent},
   // otherwise redirect to home
   { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  declarations: [ 
                  HistoryNotFoundComponent
                ],
  entryComponents:[
                  HistoryNotFoundComponent
                ]
})
export class AppRoutingModule {}