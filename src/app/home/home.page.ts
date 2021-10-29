import { Component, ɵgetDebugNodeR2 } from '@angular/core';
import { Downloader,DownloadRequest,NotificationVisibility } from '@ionic-native/downloader/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import {File} from '@ionic-native/file/ngx';
import { Filesystem } from '@capacitor/filesystem';
import { range } from 'rxjs';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx'
import { Extractor } from '@angular/compiler';
import { StringDecoder } from 'string_decoder';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  loc:any=""
  data:any=""
  private database: SQLiteObject;
  constructor(private downloader:Downloader, public zip:Zip, public file:File,public sqlite:SQLite) {
    this.sqlite.create({name:'data.db',location:'default'}).then((db:SQLiteObject)=>{
      this.database = db
      db.executeSql(`create table if not exists filedata(
        filename char(10) ,
        path char(20) PRIMARY KEY,
        data LONGTEXT
      )`,[]).then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }
  
 
  // // firebase link for 10 mb file
  Download3(){
    var request: DownloadRequest = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    title: 'MyDownload3',
    description: '',
    mimeType: '',
    visibleInDownloadsUi: true,
    notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
    destinationInExternalFilesDir: {
        dirType: 'Downloads',
        subPath: 'MyFile.apk'
    }
  };


    this.downloader.download(request)
    .then((location: string) => console.log('File downloaded at:'+location))
    .catch((error: any) => console.error(error));
  }


  AccessDB(){
    this.database.executeSql("SELECT * FROM filedata", []).then((data) => {
      console.log("Reading DB :"+data.rows.length)
      if(data.rows.length > 0) {
          for(var i = 0; i < data.rows.length; i++) {
              console.log(data.rows.item(i).filename + ' : ' + data.rows.item(i).path +' : ' + data.rows.item(i).data)
          }
      }
      console.log("Read DB")
  }, (e) => {

      console.log("Error: " + JSON.stringify(e));
  });
  }

  DeleteDB(){
    let q = "DELETE FROM filedata";
    this.database.executeSql(q,[])
  }

  DropDB(){
    let q = "DROP TABLE filedata";
    this.database.executeSql(q,[])
    alert('!!!RESTART APP!!!')
  }

  async readDir(Curpath: string,Curfolder: string){
    this.file.listDir(Curpath, Curfolder).then(async (results) => {
      console.log(results);
      for (let f of results) {
        if (f.isDirectory == true && f.name != '.' && f.name != '..') {
          console.log("This is a folder"+f.name);
          await this.readDir(Curpath+Curfolder+'/',f.name);
        } 
        else if (f.isFile == true) {
          console.log("This is a file");
          let name = f.name 
          console.log("file name: " + name);
            
          await Filesystem.readFile({
            path: Curpath+Curfolder+'/'+name
          }).then(res => {
            let data=res.data.toString()
            let q = "INSERT INTO filedata (filename,path,data) VALUES (?, ?, ?) ON CONFLICT(path) DO UPDATE SET data = ?";
            this.database.executeSql(q,[name,Curpath+Curfolder+'/'+name,data,data])
          });   
         }
       }
    });
  }
  
  nextEnqueueIndex = 0;
  lastDequeuedIndex = 0;
  dequeued="";
  location_list=[];
  i1=0;
  i2=1; 
  i3=2;
  i4=3;
  i5=4;
  f=0;
  filelocation="";
size(){
    return this.nextEnqueueIndex - this.lastDequeuedIndex;
  }

enqueue(item){
  this.location_list[this.nextEnqueueIndex] = item;
  this.nextEnqueueIndex++;
}

dequeue(){
  if (this.lastDequeuedIndex !== this.nextEnqueueIndex) {
    this.dequeued = this.location_list[this.lastDequeuedIndex];
    delete this.location_list[this.lastDequeuedIndex];
    this.lastDequeuedIndex++;
    return this.dequeued;
  }
}
  
  list=[
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/cat1.zip?alt=media&token=cb93e5e3-5475-4533-969e-9717aa2b42cd',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/cat1.zip?alt=media&token=cb93e5e3-5475-4533-969e-9717aa2b42cd',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/cat1.zip?alt=media&token=cb93e5e3-5475-4533-969e-9717aa2b42cd',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/cat1.zip?alt=media&token=cb93e5e3-5475-4533-969e-9717aa2b42cd',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/cat1.zip?alt=media&token=cb93e5e3-5475-4533-969e-9717aa2b42cd',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/cat1.zip?alt=media&token=cb93e5e3-5475-4533-969e-9717aa2b42cd',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7',
    'https://firebasestorage.googleapis.com/v0/b/cat-storage-48c6b.appspot.com/o/source10.zip?alt=media&token=6ca28506-b860-4eef-9c1c-6472f11828b7'
  ]
  indi=0;
  async ExtractRead(){
    console.log("size:"+(this.size()).toString());
    if(this.indi>13){
      return;
    }
    while(this.size()==0 ){
      
    }
      this.filelocation=this.dequeue();
      console.log("dequed :"+this.filelocation);
      await new Promise(f => setTimeout(f,2000)); 
        this.zip.unzip(this.filelocation,this.file.externalApplicationStorageDirectory+'Extracted/'+this.indi.toString()+'/', (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
        .then(async (result) => {
          if(result === 0){
            console.log('SUCCESS');
            this.loc="Success";
            await this.readDir(this.file.externalApplicationStorageDirectory+'Extracted/',this.indi.toString());
            this.indi++;  
            console.log("Extracted and inserted"+this.indi); 
            this.ExtractRead();
          } 
          if(result === -1) console.log('FAILED');
    
        }); 
      
  }

  index=0;
  async DownloadFileAt(ind){

    if(ind>13){
      return;
    }
    var request: DownloadRequest = {
      uri: this.list[ind],
      title: 'CrashTest'+ind.toString(),
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
          dirType: 'Downloads',
          subPath: 'MyZip'+ind.toString()+'.zip'
        }
    };


    //this.enqueue("file:///storage/emulated/0/Android/data/io.ionic.starter/files/Downloads/"+'MyZip'+ind.toString()+'.zip');
    this.downloader.download(request).then(async (location:string)=>{
      this.loc=location;
    this.enqueue(this.loc);
    if(ind==0){
      this.ExtractRead();
    }
     console.log("loc:"+this.location_list);
     this.index++;
     await this.DownloadFileAt(this.index);
     
    // await new Promise(f => setTimeout(f,2000));
   /*   this.zip.unzip(this.loc,this.file.externalApplicationStorageDirectory+'Extracted/'+ind.toString()+'/', (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
    .then(async (result) => {
      if(result === 0){
        console.log('SUCCESS');
        this.loc="Success";
        await this.readDir(this.file.externalApplicationStorageDirectory+'Extracted/',ind.toString());
        this.index++;
        this.DownloadFileAt(this.index);
      } 
      if(result === -1) console.log('FAILED');

    });
    */
    },(err)=>{
      alert(JSON.stringify(err));
    })
  }

  DownloadFile5(ind){
    var request: DownloadRequest = {
      uri: this.list[ind],
      title: 'CrashTest'+ind.toString(),
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
          dirType: 'Downloads',
          subPath: 'MyZip'+ind.toString()+'.zip'
        }
    };

    this.downloader.download(request).then((location:string)=>{
      this.loc=location;
      this.f=0;
      //added enqueue funtion
      this.enqueue(this.loc);
      console.log(this.location_list);
      
    },(err)=>{
      alert(JSON.stringify(err));
    })
  }


  async CrashTest(){
    this.index=0;
    this.indi=0;
    this.nextEnqueueIndex = 0;
    this.lastDequeuedIndex = 0;
    this.dequeued="";
    this.location_list=[];
    this.DownloadFileAt(0);
   
   // this.i4=3;
   // this.i5=4;

 /*    while(1){
      this.f=1;
      if(this.i1<this.list.length)
      this.DownloadFileAt(this.i1);
      else
      break;
      if(this.i2<this.list.length)
      this.DownloadFileAt(this.i2);
      else
      break;
      if(this.i3<this.list.length)
      this.DownloadFileAt(this.i3);
      else
      break;
      console.log("val:"+this.f.toString());
      await new Promise(f => setTimeout(f,2000));
      console.log("Next loop"+this.i1.toString());
      this.i1+=3; this.i2+=3; this.i3+=3; 
    //   this.ExtractRead(); 
      //this.i4+=5; this.i5+=5;
    }
  
  } */
  

}
}
