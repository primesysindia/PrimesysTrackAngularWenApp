import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, interval, throwError } from 'rxjs';
import { retryWhen, map, mergeMap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  localApi: any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/'
  constructor(private http: HttpClient, private logServ: LoginService) { }

  getTripReport(imei_no, startDt, endDt){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('DeviceImieNo', imei_no)
    .set('StartDateTime', startDt)
    .set('EndDateTime', endDt)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetDirectTripReport', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }//end getTripReport()

  getDeviceCurrStatReport(currentDt,pastMin,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    //console.log(currentDt+"\n"+pastMin+"\n"+parentId)

    let params = new HttpParams()
    .set('StartDateTime', currentDt)
    .set('pastMin', pastMin)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GenerateGPSHolder10MinData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getDeviceOnReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GenerateGPSDeviceOnData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getDeviceOffReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GenerateGPSDeviceOFFData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getMonitorSOSReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl +'UserServiceAPI/GetSosData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getDeviceONOffStatus(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/DeviceONOffStatus', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getBatteryStatusReport(repoDate,parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('StartDateTime', repoDate)
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetBatteryData', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getTodayDeviceStatus(parentId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }

    let params = new HttpParams()
    .set('ParentId', parentId)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/TodayDeviceStatus', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getExceptionReportMasterList(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.get(this.logServ.apiUrl +'UserServiceAPI/GetReportTypeFilterMaster', options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getExceptionReport(repoDate,parentId, reportType){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('Timestamp', repoDate)
    .set('ParentId', parentId)
    .set('ReportType', reportType)
    // console.log(params)

    return this.http.post(this.logServ.apiUrl +'UserServiceAPI/GetExceptionReportFileByFilter', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getDateWiseExceptionReport(parentId, reportType, startDt, endDt){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('ParentId', parentId)
    .set('reportType', reportType)
    .set('StartTimestamp', startDt)
    .set('EndTimestamp', endDt)

    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/getDeviceRangeExceptionReport', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getAddress(lat, lng){
   return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key="+environment.googleApiKey)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  // get battery on/off status api
  GetBatteryStatus (imei) {
    let params = new HttpParams()
    .set('imeiNo', imei)
    .set('StartDateTime', '0')
    .set('EndDateTime', '0')
    //  console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     var res = this.http.post(this.logServ.apiUrl +'AdminDashboardServiceApi/GetBatteryDetailPowerOnOffInfo', params,options)
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

  getSummaryReport(parentId, tStamp, roleId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    // .set('ParentId', parentId)
    .set('parentId', parentId)
    .set('timeStamp', tStamp)
    .set('roleId', roleId)
    
    // console.log("param",params)
    return this.http.post(this.logServ.apiUrl + 'ReportAPI/GetReportSummeryInfo', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }

  getPatrolmanSummaryReport(parentId, tStamp, roleId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('roleId', roleId)
    .set('parentId', parentId)
    .set('timeStamp', tStamp)
    // console.log("param",params)
    return this.http.post(this.logServ.apiUrl + 'ReportAPI/GetDailySummaryOfDeviceFromReportSummaryOfPatrolMan', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
    .pipe(map((res) => res))
  }
}

