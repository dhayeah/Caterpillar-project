import { Component } from '@angular/core';
import { Downloader,DownloadRequest,NotificationVisibility } from '@ionic-native/downloader/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import {File} from '@ionic-native/file/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   loc:any="";
  constructor(private downloader:Downloader,public zip:Zip,public file:File) 
  {
    
  }
  ngOnInit()
  {
     
  }
  download()
  {
      var downloadurl="https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/cat1.zip?alt=media&token=cb93e5e3-5475-4533-969e-9717aa2b42cd";
      
      var request:DownloadRequest={
        uri:downloadurl,
        title:"Mydownload",
        description:"ionic 4 downld test",
        mimeType:"application/zip",
        visibleInDownloadsUi:true,
        notificationVisibility:NotificationVisibility.
        VisibleNotifyCompleted,
        destinationInExternalFilesDir:{
          dirType:'Downloads',
          subPath:'My.zip'
        }
                  
      };
      this.downloader.download(request).then((location:string)=>{
        alert("File downloaded at :"+location);
        this.loc=location;
        this.zip.unzip(this.loc,this.file.externalApplicationStorageDirectory, (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
      .then((result) => {
        if(result === 0){
          console.log('SUCCESS');
          this.loc="Sucess";
        } 
        if(result === -1) console.log('FAILED');
      });
      
      },(err)=>{
        alert(JSON.stringify(err));
      })
      
      
  }

}
