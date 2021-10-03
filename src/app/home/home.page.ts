import { Component, ɵgetDebugNodeR2 } from '@angular/core';
import { Downloader,DownloadRequest,NotificationVisibility } from '@ionic-native/downloader/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import {File} from '@ionic-native/file/ngx';
import { Filesystem } from '@capacitor/filesystem';
import { range } from 'rxjs';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx'

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
              console.log(data.rows.item(i).filename + ' : ' + data.rows.item(i).path)
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
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5',
    'https://firebasestorage.googleapis.com/v0/b/downloader-31ec1.appspot.com/o/data%20structures.zip?alt=media&token=0bdbc66f-6f43-4c8d-8118-cd2f6ede52e5']

  index=0;
  DownloadFileAt(ind){
    if(ind>=5) return;
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
      //added enqueue funtion
      this.enqueue(this.loc);
      
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

  CrashTest(){
    this.i1=0;
    this.i2=1; 
    this.i3=2;
    this.i4=3;
    this.i5=4;
    while(1){
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
      if(this.i4<this.list.length)
      this.DownloadFileAt(this.i4);
      else
      break;
      if(this.i5<this.list.length)
      this.DownloadFileAt(this.i5);
      else
      break;

      this.i1+=5; this.i2+=5; this.i3+=5; this.i4+=5; this.i5+=5;
  
    }
        
  }

}

/*

size(): number {
  return this.nextEnqueueIndex - this.lastDequeuedIndex;
}

export class Queue<T>{
  private data: { [index: number]: T } = Object.create(null);
  private nextEnqueueIndex = 0;
  private lastDequeuedIndex = 0;

   Enqueues the item in O(1) 
  enqueue(item: T): void {
    this.data[this.nextEnqueueIndex] = item;
    this.nextEnqueueIndex++;
  }

  
   * Dequeues the first inserted item in O(1)
   * If there are no more items it returns `undefined`
   
  dequeue(): T | undefined {
    if (this.lastDequeuedIndex !== this.nextEnqueueIndex) {
      const dequeued = this.data[this.lastDequeuedIndex];
      delete this.data[this.lastDequeuedIndex];
      this.lastDequeuedIndex++;
      return dequeued;
    }
  }
}

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
        this.zip.unzip(this.loc,this.file.externalApplicationStorageDirectory+'Extracted/', (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
      .then((result) => {
        if(result === 0){
          console.log('SUCCESS');
          this.loc="Sucess";
          this.file.listDir(this.file.externalApplicationStorageDirectory, 'Extracted').then(async (results) => {
            console.log(results);
             for (let f of results) {
               if (f.isDirectory == true && f.name != '.' && f.name != '..') {
                 console.log("This is a folder");
               } else if (f.isFile == true) {
                 console.log("This is a file");
                 let name = f.name 
                 console.log("file name: " + name);
                  
                  await Filesystem.readFile({
                    path: this.file.externalApplicationStorageDirectory+'Extracted/'+name
                  }).then(res => {
                    let data=res.data.toString()
                    if(name[0]=='R')
                    console.log("file data:"+ atob(data))
                  });
                  
               }
             }
          });
        } 
         
        if(result === -1) console.log('FAILED');
      });

      },(err)=>{
        alert(JSON.stringify(err));
      })
      
      
  }

}
*/
