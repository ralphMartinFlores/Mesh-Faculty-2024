import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { UploadsService } from 'src/app/services/uploads.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss']
})
export class PostsEditComponent implements OnInit {

  datatoedit: any;
  textcontent = this.data.data['content_fld'];
  files: any = [];
  fileButton: boolean;
  photoButton: boolean;
  videoButton: boolean;
  removeFiles:  boolean;
  withfile: number = 0;
  filepathtoupload: any;
  isUploading: boolean;
  filepath: FormData;
  disableButton:number;
  submittedFiles: any = [];
  filesToBeUpdated: any = [];
  existingDir: any;
  split: any;
  combined: any;
  editFiles: any = [];


  constructor(public _upload:UploadsService, 
    private _ds: DataService, 
    public dialog: MatDialog,
    private _snackbar:MatSnackBar, 
    public _user:UserService, 
    @Inject(MAT_DIALOG_DATA) public data: any, private dialogReg: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.buttondisablerpost();    
  }
  
  async editpost(v: number) {   
    this._user.setLoading(true);  
    if (this.files.length != 0) {
      await this._upload.Filepath(this.files).then((filepath:any)=>{
        // console.log(filepath);
        if (this.existingDir === null || this.existingDir === undefined ) {
          this.filepathtoupload = filepath;
          this._user.setLoading(false);  

          // console.log(this.existingDir);
          
        }else{
          this.split = this.existingDir.split(':');
          this.split.push(filepath);
          this.combined = this.split.join(':');  
          // console.log(this.combined);
           
          this.filepathtoupload = this.combined; 
          this._user.setLoading(false);  
 
        }       
          
      }).catch(e=>{
        return;
        
      });
    }else{
      this.filepathtoupload = this.existingDir; 
      this._user.setLoading(false);  

      // console.log(this.filepathtoupload);
           
    }
    
    
  this.dialogReg.close({
    data : {
      data:{
        classcode_fld:this._user.getSelectedClass().classcode_fld,
        authorid_fld:this._user.getUserID(),
        content_fld:this.textcontent,
        withfile_fld:this.withfile,
        dir_fld:this.filepathtoupload
      },
      notif:{
        id:this._user.getUserID(),
        recipient: this._user.getSelectedClass().empcode_fld,
        message: this._user.getFullname()+' edited a post on '+this._user.getSelectedClass().subjdesc_fld,
        module: 'classroom'
      }
    }  
  });
 }


  buttondisablerpost(){
    // console.log(this.data);
    
    if (this.data.data['dir_fld'] != '') {
      this.existingDir = this.data.data['dir_fld'];
      this.submittedFiles = this._upload.splitFilestring(this.data.data['dir_fld']);
      // console.log(this.submittedFiles);
      for (let i = 0; i < this.submittedFiles.length; i++) {
        var ext = this.getext(this.submittedFiles[i].name);
          switch (ext) {
            case 'txt':
            case 'doc':
            case 'docx':
            case 'html':
            case 'htm':
            case 'odt':
            case 'pdf':
            case 'xls':
            case 'xlsx':
            case 'ods':
            case 'pdf':
            case 'ppt':
            case 'pptx':
            this.fileButton = false;
            this.photoButton = true;
            this.videoButton = true;
            this.withfile = 5;
            break;
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
            this.fileButton = true;
            this.photoButton = true;
            this.videoButton = false;
            this.withfile = 2;
            break;
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':   
            case 'jfif':
              this.fileButton = true;
              this.photoButton = false;
              this.videoButton = true;
              this.withfile = 1;
            break;
          }      
        
      }
    }else{
      this.fileButton = false;
      this.photoButton = false;
      this.videoButton = false;
    }
    
  }
  async getFile(event) {
    let sum: number = 0;
    for (var i = 0; i < event.target.files.length; i++) {
      sum += event.target.files[i].size;
      this.files.push(event.target.files[i]);      
      var ext = this.getext(this.files[i].name);
      switch (ext) {
        case 'txt':
        case 'doc':
        case 'docx':
        case 'html':
        case 'htm':
        case 'odt':
        case 'pdf':
        case 'xls':
        case 'xlsx':
        case 'ods':
        case 'pdf':
        case 'ppt':
        case 'pptx':
         this.fileButton = false;
         this.photoButton = true;
         this.videoButton = true;
         this.withfile = 5;
        break;
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
         this.fileButton = true;
         this.photoButton = true;
         this.videoButton = false;
         this.withfile = 2;
        break;
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':   
        case 'jfif':
          this.fileButton = true;
          this.photoButton = false;
          this.videoButton = true;
          this.withfile = 1;
        break;
      }     
      this._upload.getFile(this.files) 
    }
    if (sum > 30000000) {
      this._snackbar.open((sum / 1048576).toFixed(2).toString() + "File to big error",null,{duration:1500})
      //  console.log((sum / 1048576).toFixed(2).toString() + "File to big error");
      this.files = [];
      (<HTMLInputElement>document.getElementById('files')).value = '';
    }else{
      (<HTMLInputElement>document.getElementById('files')).value = '';      
    }
  }

  async deletefile(path){
    let load = {
        dir_fld:path
    }
    return new Promise((resolve,rejects)=>{
      this._ds._httpRequest('deletefile', load, 1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        resolve(data.status.remarks);
      },er=>{
        er = this._user._decrypt(er.error.a);
        return new Promise(()=>{
          rejects (er.status.remarks)
        })
      })
    })
  }

  deletefileconfirmation(i,option){
    let condel
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        option: option,
        isConfirmed: condel
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      
      if (result.data) {
        this.unlinkedFile(i);
      }
    });
  }

  async unlinkedFile(i){
    let newFiles:any = [];
    this._user.setLoading(true)
    await this.deletefile(this.submittedFiles[i].path).then(()=>{
      this.submittedFiles.splice(i, 1);
      this.submittedFiles.map((e)=>{
        newFiles.push(e.name+'?'+e.path);
      });
      newFiles = newFiles.join(':');
      // console.log(newFiles);
      let load = {
        data:{
          withfile_fld: newFiles == '' ? 0 : this.withfile,
          dir_fld: newFiles
        },
        notif:{
          id:this._user.getUserID(),
          recipient: this._user.getSelectedClass().empcode_fld,
          message: this._user.getFullname()+' remove a post on '+this._user.getSelectedClass().subjdesc_fld,
          module: 'classroom'
        }
      };
      if (newFiles == '') {
        this.fileButton = false;
        this.photoButton = false;
        this.videoButton = false;
      }
      this._ds._httpRequest('editpost/'+this.data.data['postcode_fld'], load, 1).subscribe((data:any)=>{
        data = this._user._decrypt(data.a);
        // console.log(data);
        if (data.payload[0].dir_fld == '') {
          this.existingDir = null;
        }else{
          this.existingDir = data.payload[0].dir_fld;
        }
        
        
        this.withfile = data.payload[0].withfile_fld;
        this._user.setLoading(false);
        
        // console.log(data);
        
      },er=>{
        er = this._user._decrypt(er.error.a);
        // console.log(er);
        
      })
      
    });
    
  }

  async removeFile(i) {

    this.files.splice(i, 1);
    if (this.files.length == 0) {
      this.fileButton = false;
      this.photoButton = false;
      this.videoButton = false;
    }
    // console.log("remove");
    

  }

  getext(data) {
    return data.split('.').pop();
  }


  getFileExtension(filename) {
    if (filename == 'docx') { return '#004db3'; }
    if (filename == 'pptx') { return '#c34524'; }
    if (filename == 'txt') { return '#95a5a6'; }
    if (filename == 'pdf') { return '#ad0b00'; }
    else {
      return '#1f6499';
    }
  }
  getfileExt(filename) {
    return filename.split('.').pop();
  }

}
