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
      var downloadurl="https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/sample.zip?alt=media&token=0c9ce1d0-b35d-4d03-901f-da4f79ca4529";
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
