import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class BeatServicesService {
  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/';

  constructor(private http: HttpClient, private logServ: LoginService) { }

  saveKeymenBeats (data: any) {
    var daata = JSON.parse(data);
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('KeymanBeatData',JSON.stringify(daata))
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveKeymanBeatInBulk', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  getKeymanExistingBeatByParent(parId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    var res = this.http.post(this.logServ.apiUrl+ 'AdminDashboardServiceApi/GetKeymanExistingBeatByParent', params, options)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  getApprovedKeymenBeats (parId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetKeymanExistingBeatToApproveByParent', params, options)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  savePatrolmenBeats (data: any) {
    var data = JSON.parse(data);
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', data.parentId)
    .set('name', data.name)
    .set('userLoginId', data.userLoginId)
    .set('contactNo', data.contactNo)
    .set('seasonId', data.seasonId)
    .set('emailId', data.email)
    .set('patrolmenFormArray', JSON.stringify(data.patrolmenFormArray))
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/AddPatrolmanBeatBulk', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }


  getPatrolmenBeatByStdId (stdId, seasonId) {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('studentId', stdId)
    .set('seasonId', seasonId)
    .set('userLoginId', userLoginId)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetPatrolManExistingBeatByStudentAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from serve
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  getPatrolmenExistingBeatByParent(parId, seasonId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    .set('seasonId', seasonId)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetPatrolmanExistingBeatToApproveByParentForUser', params, options)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(


          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  getKeymenExistingBeat(parId, stdId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    .set('studentId', stdId)
    .set('beatId', '0')
    .set('userLoginId', parId)

    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetKeymanExistingBeat', params, options)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }
  
  // get railway department hierarchy api
  GetRailwayDepHierarchy (pId) {
   var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
   var userLoginId = userInfo.usrId;
 
   let options = {
     headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
   };
 
    let params = new HttpParams()
   .set('parentId', pId)
   .set('hirachyParentId', '0')
   .set('userLoginId', userLoginId)
   var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetRailwayDeptHierarchy', params, options) 
   return res .pipe(
     //retry upto 3 times after getting error from server
     retryWhen((error:any) => {
       return interval(5000).pipe(
         mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
       )}
     )
   ) 
 }

  //  get all patrolmen beat
  getPatrolmenExistingBeat(parId, seasonId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', parId)
    .set('seasonId', seasonId)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetPatrolMenExistingBeatByParentAPI', params, options)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  //  get all patrolmen beat
 getVideoLink() {
  let options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  };
  var res = this.http.get(this.logServ.apiUrl + 'UserServiceAPI/GetVideoLinksForDemo', options)
  return res .pipe(
    //retry upto 3 times after getting error from server
    retryWhen((error:any) => {
      return interval(5000).pipe(
        mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
      )}
    )
  ) 
}
}



// http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/AdminDashboardServiceApi/GetPatrolMenBeatAPI 