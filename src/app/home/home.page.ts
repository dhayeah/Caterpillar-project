import { Component } from '@angular/core';
import { Downloader,DownloadRequest,NotificationVisibility } from '@ionic-native/downloader/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private downloader:Downloader) 
  {
    
  }
  ngOnInit()
  {
     
  }
  download()
  {
      var downloadurl="https://drive.google.com/uc?export=download&id=1F0ZXcSVJItKIf4ZD_gZRsDN61FB20ixO";
      var request:DownloadRequest={
        uri:downloadurl,
        title:"Mydownload",
        description:"ionic 4 downld test",
        mimeType:"image/png",
        visibleInDownloadsUi:true,
        notificationVisibility:NotificationVisibility.
        VisibleNotifyCompleted,
        destinationInExternalFilesDir:{
          dirType:'Downloads',
          subPath:'My.png'
        }
                  
      };
      this.downloader.download(request).then((location:string)=>{
        alert("File downloaded at :"+location);
      },(err)=>{
        alert(JSON.stringify(err));
      })
  }

}
