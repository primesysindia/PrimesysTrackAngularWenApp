import { Component, OnInit } from '@angular/core';
import { BeatServicesService } from '../services/beat-services.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-all-videos-page',
  templateUrl: './all-videos-page.component.html',
  styleUrls: ['./all-videos-page.component.css']
})
export class AllVideosPageComponent implements OnInit {
  responseData: any;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  Url: any;
  loading : boolean;
  constructor(private beatService: BeatServicesService, private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.loading = true;
     this.beatService.getVideoLink()
    .subscribe(data => {
      this.loading = false;
      this.responseData = data;
      // this.getDevices();
    })
    this.loading = false;
  }

}
