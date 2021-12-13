import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  isactive : boolean = false;
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  isTiled : boolean = true;
  bookTitle: string;
  bookObject;
  bookObjectIndividual;
  searchList;

  constructor(private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public _ds: DataService,
    public _user: UserService) {  }

  ngOnInit(): void {

    // this.getBooks();

  }
  toggleview(){
    this.isTiled = !this.isTiled;
  }
  

Search(){
  let book: any;
  let author: any;
  book = this.searchList.filter( 
    (res:any)=> res.title_fld.toLocaleLowerCase().match(this.bookTitle.toLocaleLowerCase()));
  author = this.searchList.filter(
    (res:any) => res.author_fld.toLocaleLowerCase().match(this.bookTitle.toLocaleLowerCase())
  )
  if(this.bookTitle == ""){
    this.getBooks();
  } else if(this.bookTitle != "") {
    
    if(book == ''){
      this.bookObject = author;
    } else {
      this.bookObject = book;
    }
  }
  
}


getBooks(){
  this._ds._httpRequest('getbooks', '', 1).subscribe((dt: any) => {
    dt = this._user._decrypt(dt.a);
    this.bookObject = dt.payload;
    // this._user.setBook(this.bookObject);
    this.searchList = this.bookObject;
  }, er => {
    let err = this._user._decrypt(er.error.a);
  });
  
}

getBook(i){
  // this._ds._httpRequest('getbook', {bookcode_fld: ''}, 1).subscribe((dt: any) => {
  //   dt = this._user._decrypt(dt.a);
  //   this.bookObjectIndividual = dt.payload;
  //   this.openbook();
  // }, er => {
  //   let err = this._user._decrypt(er.error.a);
  // });

  // this._ds._httpRequest('updateclicks', {bookcode_fld: this._user.getBook()[i].bookcode_fld, title_fld: this._user.getBook()[i].title_fld}, 1).subscribe((dt: any) => {
  //   dt = this._user._decrypt(dt.a);

  // }, er => {
  //   let err = this._user._decrypt(er.error.a);
  // });


  
}

  openbook(){


    // let data = {
    //   type: 'viewbooks',
    //   book: this.bookObjectIndividual
    // };
    // const dialogRef = this.dialog.open(ViewbookComponent, {
    //   width: '80%',
    //   height: '100%',
    //   maxWidth: '80%',
    //   maxHeight: '100vh',
    //   data: data
    // });
    // const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
    //   if (result.matches) {
    //     dialogRef.updateSize('100%', '100vh');
    //   } else {
    //     dialogRef.updateSize('90%', '100vh');
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   responsiveDialogSubscription.unsubscribe();
    //   // this.ngOnInit();
    //   // if (result != undefined) { this.resourceObject = result }
    // });
  }
  addBook(){
    // let data = {
    //   type: 'addbooks',
    //   book: ''
    // };
    // const dialogRef = this.dialog.open(AddbookComponent, {
    //   width: '10%',
    //   height: '100%',
    //   maxWidth: '100vw',
    //   maxHeight: '100vh',
    //   data: data,
    //   autoFocus: false
    // });
    // const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
    //   if (result.matches) {
    //     dialogRef.updateSize('100%', '100vh');
    //   } else {
    //     dialogRef.updateSize('90%', '100vh');
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   responsiveDialogSubscription.unsubscribe();
    //   this.ngOnInit();
    //   // if (result != undefined) { this.resourceObject = result }
    // });
  }

  
}
