import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetDeviceService {
localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/';
  constructor(private http: HttpClient, private logServ: LoginService) { }

  getAllDeviceList(userId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('parentId', userId)

    return this.http.post(this.logServ.apiUrl+'LoginServiceAPI/getTrackInfo', params, options) 
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )          
  }

  getAllDeviceLocation(userId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('ParentId', userId)

    return this.http.post(this.logServ.apiUrl +'UserServiceAPI/GetOptimizedAllDeviceLocation', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }
 // get railway trip master api
 GetRailwayPetrolmanTripsMaster(pId) {
  let options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  };
  let params = new HttpParams()
  .set('parentId', pId)
  // console.log("paarams", params)

  var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetRailwayPetrolmanTripsMaster', params, options) 
  // console.log("res", res) 
  return res .pipe(
    //retry upto 3 times after getting error from server
    retryWhen((error:any) => {
      return interval(5000).pipe(
        mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
      )}
    )
  )
}

// get section name from api
getSectionName(pId) {
  let options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  };

   let params = new HttpParams()
  .set('parentId', pId)

  var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetSectionNames', params, options) 
  return res .pipe(
    //retry upto 3 times after getting error from server
    retryWhen((error:any) => {
      return interval(5000).pipe(
        mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
      )}
    )
  ) 
}

 // save master trip api
 SavePatrolmanMasterBeat(data: any) {
  // console.log("data", data)
  let studentId = JSON.parse(localStorage.getItem('StudentID'))
  var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
  var userLoginId = userInfo.usrId;

  let options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  };
  let params = new HttpParams()
  .set('parentId', data.pId)
  .set('tripName', data.tripName)
  .set('tripStartTime', data.tripStartTime)
  .set('tripEndTime', data.tripEndTime)
  .set('userLoginId', userLoginId)

  var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveRailwayPatrolManTripTimeMaster ', params, options) 
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
