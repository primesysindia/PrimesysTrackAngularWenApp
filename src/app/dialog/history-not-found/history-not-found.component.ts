import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-history-not-found',
  templateUrl: './history-not-found.component.html',
  styleUrls: ['./history-not-found.component.css']
})


export class HistoryNotFoundComponent implements OnInit {

  deviceName: string;
  msg: string;
  message: string;
  iconName: string;
  email: string = 'contact@primesystech.com';
  subExp:boolean = false;
  safeHtml: SafeHtml = '';
  driverName: string;
  refreshBtn: boolean = false;
  showBtn : boolean = true;
  ticketId: any;

  constructor(private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<HistoryNotFoundComponent>,
    @Inject(MAT_DIALOG_DATA) data        
    ) {
      this.msg =data.hint; 
      this.deviceName = data.devName;
      this.driverName = data.driverNm;
      this.ticketId = data.ticketId;
    }
  

  ngOnInit() {
    if(this.msg == 'reportNotFound')
    {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Ooops...Report not found for '+this.deviceName+' device'
    }
    else if(this.msg == 'NoReportFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = "Ooops.. Report not found"
    }
    else if(this.msg == 'ReportAvailableSoon'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = "Report will be availbale soon.."
    }
    else if(this.msg == 'ExceptionReportNotFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = "Report will be available soon.."
    }
    else if(this.msg == 'locationNotFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml('Ooops... Location not found for all devices. Please switch ON all devices.<br/>'+
                      'OR Your subscription for devices get expired.'+
                      'Please contact to admin on <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@primesystech.com" target="_blank">contact@primesystech.com</a>')
    }
    else if(this.msg == 'downloadReport'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = "Report downloaded successfully... Please check in downloads folder."
    }
    else if(this.msg == 'ServerError'){
      this.iconName = 'error_outline'
      this.message = "Your network might be slower. Please refresh page."
    }
    else if(this.msg == 'SubscriptionExpire'){
      this.subExp = true;
      this.iconName = 'notification_important'
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml('Your subscription for '+this.deviceName+' device has expired.<br/>'+
                      'Please contact to admin on <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@primesystech.com" target="_blank">contact@primesystech.com</a>')
    }
    else if(this.msg == 'liveLocationNotFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Location not found for '+this.deviceName+' device'
    }
    else if(this.msg == 'NoAccessToReport'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'No such report available'
    }
    else if(this.msg == 'feedbackSent'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Thank you for your valuable feedback.'
    }
    else if(this.msg == 'DeviceNotRegister'){
      this.subExp = true;
      this.iconName = 'notification_important'
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml('The device is not registered for '+this.deviceName+'.</br>'+
                      'Please contact to admin on <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@primesystech.com" target="_blank">contact@primesystech.com</a>')
    }
    else if(this.msg == 'feedbackNotSent'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Feedback not submitted... Please send again.'
    }
    else if(this.msg == 'EmpNotAdded'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Employee not added... Please try again after sometime.'
    }
    else if(this.msg == 'EmpAdded'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Employee added successfully.'
    }
    else if(this.msg == 'NoInternetConnection'){
      this.iconName = 'warning'
      this.message = 'You are offline... Please check your internet connection and refresh the page.'
    }
    else if(this.msg == 'NoDeviceList'){
      this.iconName = 'warning'
      this.message = 'Ooops... No devices found for you...!'
    }
    else if(this.msg == 'NoTaskFound'){
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Oops... No Tasks found for '+this.driverName
    }
    else if(this.msg == 'taskCopied'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Tasks added successfully for '+this.driverName
    }
    else if(this.msg == 'rdpsLoaded'){
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'RDPS data loaded successfully!! Please Refresh the page to view rdps'
      this.refreshBtn = true;
      this.showBtn = false;
    }
    else if(this.msg == 'issueHistoryNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Issue History Not Found!!' 
    }
    else if(this.msg == 'IssueAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Issue Registered Successfully for '+this.ticketId+'!!'
    }
    else if(this.msg == 'IssueNotAdded') {
      this.iconName = 'warning'
      this.message = 'Issue Not Added.. Try Again!!' 
    }
     else if(this.msg == 'beatAdded') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Beat Added Successfully !!'
    }
    else if(this.msg == 'beatNotAdded') {
      this.iconName = 'warning'
      this.message = 'Beat Not Added.. Try Again!!' 
    }
    else if(this.msg == 'removeRows') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Please remove empty rows !!' 
    }
    else if(this.msg == 'noTripsAvailable') {
      this.iconName = 'sentiment_satisfied_alt'
      this.message = 'Trips not found!!' 
    }
    else if(this.msg == 'beatNotFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Sorry.. Beat not found !!' 
    }
    else if(this.msg == 'NoModuleFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Sorry.. No modules available!!' 
    }
    else if(this.msg == 'invalidForm') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Please remove empty rows!!' 
    }
    else if(this.msg == 'NoExceptionReportListFound') {
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Sorry.. No Report List found!!' 
    }
    else{
      this.iconName = 'sentiment_very_dissatisfied'
      this.message = 'Sorry...Tracking history not found for '+this.deviceName+' device'
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  refresh() {
    window.location.reload();
  }
}
