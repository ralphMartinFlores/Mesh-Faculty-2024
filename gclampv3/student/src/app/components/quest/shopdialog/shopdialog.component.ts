import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopItems } from 'src/app/services/data-schema';
import { DataService } from 'src/app/services/data.service';
import { Crud, fldNames } from 'src/app/services/enum';
import { QuestService } from 'src/app/services/quest.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-shopdialog',
  templateUrl: './shopdialog.component.html',
  styleUrls: ['./shopdialog.component.scss']
})
export class ShopdialogComponent implements OnInit {
  shopList:any = new ShopItems();

  constructor(public dialog:MatDialog, 
    public _user:UserService, 
    public _quest:QuestService, 
    public _ds:DataService, 
    public _snackbar:MatSnackBar, 
    private dialogReg: MatDialogRef<ShopdialogComponent>) { }
    
  ngOnInit(): void {    
    this.itemChecker()
  }

  buyItem(itemcode_fld,cost){
    let questData = this._user.getQuestData()
    
    for (let i = 0; i < this.shopList.shopItems.length; i++) {
      if (this.shopList.shopItems[i].cost_fld >= questData.points_fld) {
        this._snackbar.open('Not enough points.',null,{duration:1000})
        return
      }
    }

    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true;
    if (this._user.isMobile()) {
      dialogConfig.maxHeight = '90vw';
      dialogConfig.minHeight = 'auto';
      dialogConfig.minWidth = '70vw';
      dialogConfig.maxWidth = '90vw';
    } else {
      dialogConfig.minHeight = '20vh';
      dialogConfig.minWidth = '15vw';
    }
    dialogConfig.data = {
      option:'buyItem',
      itemcode_fld:itemcode_fld
    }
    const dialogRef = this.dialog.open(DialogComponent,dialogConfig)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let splitItems = new Array() //for Splitting the items in the database
        let itemsRedeem:string = ''; //data to pass in database

        let questData = this._user.getQuestData(); //get data from session storage

        if (questData.items_acquired_fld === "") 
        {
          itemsRedeem = itemcode_fld
        }
        else
        {
          splitItems = questData.items_acquired_fld.split(';');
          splitItems.push(itemcode_fld) //push the newly redeem item
          itemsRedeem = splitItems.join(';') //joined by ';'
        }

        this._ds._httpRequest('updategameprogress',{items_acquired_fld:itemsRedeem},1).subscribe(res => {
          res = this._user._decrypt(res.a);
          this._snackbar.open('Redeem Successfully!',null,{duration:1000})

          this._user.updateUserData({items_acquired_fld:itemsRedeem},'questsdata');
          let questDataUpdate = this._user.getQuestData().items_acquired_fld

          let splitQuestUpdate = questDataUpdate.split(';');
          
          for (let i = 0; i < this.shopList.shopItems.length; i++) {
            let item = this.shopList.shopItems[i].itemcode_fld
            if (splitQuestUpdate.includes(item)) {
              this.shopList.shopItems[i].isRedeemed = false
            }else{
              this.shopList.shopItems[i].isRedeemed = true
            }
          }

          //Subtract cost to points
          this._quest.SubtractCostToPoints(cost)
        })
      }
    })
    
  }

  //init checker if item already redeemed
  itemChecker(){
    let questData = this._user.getQuestData().items_acquired_fld
    let splitQuestData = questData.split(';');

    for (let i = 0; i < this.shopList.shopItems.length; i++) {
      let item = this.shopList.shopItems[i].itemcode_fld
      if (splitQuestData.includes(item)) {
        this.shopList.shopItems[i].isRedeemed = false
      }else{
        this.shopList.shopItems[i].isRedeemed = true
      }
    }

    console.log(this.shopList.shopItems);
    
  }

  closeDialog() {
    this.dialogReg.close();
  }

}
