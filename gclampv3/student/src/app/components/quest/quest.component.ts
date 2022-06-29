import { Component, ErrorHandler, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuestDataItem } from 'src/app/services/data-schema';
import { DataService } from 'src/app/services/data.service';
import { QuestService } from 'src/app/services/quest.service';
import { UserService } from 'src/app/services/user.service';
import { staggereffect } from '../class/animation';
import { ShopdialogComponent } from './shopdialog/shopdialog.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
  animations: [
    staggereffect
  ]
})
export class QuestComponent implements OnInit {

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  questList = new QuestDataItem()
  /**
   * Declaration of Experience and levelup
   */
  resetExperienceBar: number = 0;
  experienceGain:number = 0;
  levelCount: number = 0;

  /**
   * number of points decleration
   */
  pointGained: number = 0;

  /**
   * Progress bar limit declaration
   */
  progressBarLimit: number = 0;

  /**
   * 
   * @param _user 
   */
  constructor(public _user:UserService, 
    public _ds:DataService, 
    public _quest:QuestService, 
    public dialog:MatDialog, 
    private breakpointObserver: BreakpointObserver) { }

  questDetails :any;
  questProgress:any = this._user.getQuestData();
  // showLoader: boolean = true;
  
  ngOnInit(): void {
    this.InitializeStudentAchievements();
  }

  /**
   * InitializeStudentAchievements method
   */
  public InitializeStudentAchievements() {
    /** Get data for mapping of achievements */
    this.GetAchievementData();
  }

  /**
   * GetAchievementData in the database
   */
  public GetAchievementData() {
    
    /** For resetting of experience */
    this.ExperienceResetAndLevelUp(this.questProgress.experience_fld);

    /** For points gained */
    this.PointsGained(this.questProgress.points_fld);
  }

  /**
   * Reseting Experience when reach 100%
   */
  public ExperienceResetAndLevelUp(experience:number) {
    /** For reset experience */
    this.resetExperienceBar = experience % 100;

    /** For leveling */
    this.levelCount = Math.floor(experience / 100);
  }

  /**
   * PointsGained method
   */
  public PointsGained(points:number) {
    this.pointGained = points;
  }

  /**
   * ProgressBarControl
   */
  public ProgressBarControl(data, count:number) {
    if(data =='QC001' || data =='QC002' || data =='QC003' ||data =='QC004' ){
      if(this.questProgress['cifcnt_fld'] <= count ){
        return count == this.questProgress['cifcnt_fld'] ? count/count * 100: this.questProgress['cifcnt_fld']/count * 100
      }else {
        return count/count * 100;
      }
    }
    else if(data =='QC005' || data =='QC006' || data =='QC007' ||data =='QC008' ){
      if(this.questProgress['piccnt_fld'] <= count ){
        return count == this.questProgress['piccnt_fld'] ? count/count * 100: this.questProgress['piccnt_fld']/count * 100
      }else {
        return count/count * 100;
      }
    }
    else if(data =='QC009' || data =='QC010' || data =='QC011' ||data =='QC012' ){
      if(this.questProgress['ciccnt_fld'] <= count ){
        return count == this.questProgress['ciccnt_fld'] ? count/count * 100: this.questProgress['ciccnt_fld']/count * 100
      }else {
        return count/count * 100;
      }
    }
    else if(data =='QC013' || data =='QC014' || data =='QC015' ||data =='QC016' ){
      if(this.questProgress['taskcnt_fld'] <= count ){
        return count == this.questProgress['taskcnt_fld'] ? count/count * 100: this.questProgress['taskcnt_fld']/count * 100
      }else {
        return count/count * 100;
      }
    }
    else if(data =='QC017' || data =='QC018' || data =='QC019' ||data =='QC020' ){
      if(this.questProgress['class_on_time_fld'] <= count ){
        return count == this.questProgress['class_on_time_fld'] ? count/count * 100: this.questProgress['class_on_time_fld']/count * 100
      }else {
        return count/count * 100;
      }
    }

  }

  questCode(questCode, target){
    if(questCode =='QC001' || questCode =='QC002' || questCode =='QC003' ||questCode =='QC004' ){
      if(this.questProgress['cifcnt_fld'] <= target ){
        return target == this.questProgress['cifcnt_fld'] ? target+'/'+target : this.questProgress['cifcnt_fld']+'/'+target 
      }else {
        return target+'/'+target;
      }
    }
    else if(questCode =='QC005' || questCode =='QC006' || questCode =='QC007' ||questCode =='QC008' ){
      if(this.questProgress['piccnt_fld'] <= target ){
        return target == this.questProgress['piccnt_fld'] ? target+'/'+target : this.questProgress['piccnt_fld']+'/'+target 
      }else {
        return target+'/'+target;
      }
    }
    else if(questCode =='QC009' || questCode =='QC010' || questCode =='QC011' ||questCode =='QC012' ){
      if(this.questProgress['ciccnt_fld'] <= target ){
        return target == this.questProgress['ciccnt_fld'] ? target+'/'+target : this.questProgress['ciccnt_fld']+'/'+target 
      }else {
        return target+'/'+target;
      }
    }
    else if(questCode =='QC013' || questCode =='QC014' || questCode =='QC015' ||questCode =='QC016' ){
      if(this.questProgress['taskcnt_fld'] <= target ){
        return target == this.questProgress['taskcnt_fld'] ? target+'/'+target : this.questProgress['taskcnt_fld']+'/'+target 
      }else {
        return target+'/'+target;
      }
    }
    else if(questCode =='QC017' || questCode =='QC018' || questCode =='QC019' ||questCode =='QC020' ){
      if(this.questProgress['class_on_time_fld'] <= target ){
        return target == this.questProgress['class_on_time_fld'] ? target+'/'+target : this.questProgress['class_on_time_fld']+'/'+target 
      }else {
        return target+'/'+target;
      }
    }
  }

  openShop():void {
    const dialogRef = this.dialog.open(ShopdialogComponent, {
      panelClass: 'shop',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true
    });
    const responsiveDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize('100%', 'auto');
      } else {
        dialogRef.updateSize('100%', '100%');
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      responsiveDialogSubscription.unsubscribe();
    })
  }
}
