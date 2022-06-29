import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ControlForAddingPoints, Crud, fldNames } from './enum';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class QuestService {

  constructor(public _ds:DataService, public _user:UserService) { }

  /**
   * UpdateCountAchievement
   * 
   * @param columnName
   */
  public UpdateCountAchievement(control:number,columnName:any) {
    //Initialize value for quest from session storage located at layout.component.ts
    let questObject = this._user.getQuestData();

    //Control whether the data to pass in database is increment or decrement
    let dataToPutInDatabase = this.UpdateControl(control,questObject[columnName]);   
    
    //Control points and exp
    this.AddAchievementPointsAndExp(questObject[columnName]);
    
    //Add Badges data
    let badgesAcquired = this.AddAchievementCode(columnName)

    if (columnName === fldNames.taskcnt_fld && questObject.taskcnt_fld_limit > 0) {
        let decrementTaskLimit = questObject.taskcnt_fld_limit - 1;
        this.SubmitToDatabase({taskcnt_fld_limit:decrementTaskLimit})
    }

    /**
     * if badgesAcquired is defined then continue the process here if undefined skip
     */
    if ( badgesAcquired !== undefined ) {
      this.InsertBadges(badgesAcquired)
    }
    
    //Call method for submitting to database
    this.SubmitToDatabase({[columnName]:dataToPutInDatabase});
  }

  /**
   * @method SubtractCostToPoints
   * @param cost 
   */
  public SubtractCostToPoints(cost:number):void{
    let questObject = this._user.getQuestData();
    let pointsRemaining = questObject.points_fld - cost;

    this.SubmitToDatabase({points_fld:pointsRemaining})
  }
  
  /**
   * 
   * @param control 
   * @param data 
   * 
   * @returns number
   */
  private UpdateControl(control:number, data:any): number {
    let dataToPutInDatabase:number = 0;
    switch (control) {
      case Crud.ADD:
        return dataToPutInDatabase = data + 1;
      case Crud.REMOVE:
        return dataToPutInDatabase = data - 1;
      default: 
        return dataToPutInDatabase = data;
    }
  }

  /**
   * AddAchievementPointsAndExp
   * 
   * @param fldPoints
   */
  private AddAchievementPointsAndExp(fldPoints:number) {
    /** Gaining Points */
    let questObject = this._user.getQuestData();
    let points:number = questObject.points_fld;
    let dataToPutInDatabase = this.PointsControl(fldPoints,points)

    /**Gaining Experince */
    let experienceGained = questObject.experience_fld;
    let experienceAdded = experienceGained + 3;
    
    /** Payload to send in the database */
    let payload = {
      points_fld: dataToPutInDatabase,
      experience_fld:experienceAdded
    }
    
    /** Method for submitting to database */
    this.SubmitToDatabase(payload)
  }

  /**
   * This method is for submitting data to db
   * 
   * @param payload 
   */
  private SubmitToDatabase(payload:any) {
    this._ds._httpRequest('updategameprogress',payload,1).subscribe((data:any)=>{

      this._user.updateUserData(payload,'questsdata');
    },er=>{
      er = this._user._decrypt(er.error.a);
    })
  }

 /**
  * This method is for controlling the points to add in the database
  * 
  * @param fldPoints 
  * @param points 
  * @returns points
  */
  private PointsControl(fldPoints:number,points:number): number {
    switch (fldPoints) {
      case ControlForAddingPoints.BRONZE:        
        points = points + 5;
        return points;
      case ControlForAddingPoints.SILVER:
        points = points + 5;
        return points;
      case ControlForAddingPoints.GOLD:
        points = points + 5;
        return points;
      case ControlForAddingPoints.PLATINUM:
        points = points + 5;
        return points;
      default: 
        return points;
    } 
  }

  /**
   * This method is for getting what badge to insert in the array and pass to the database as string joined by ';'
   * @param fldName 
   * @returns string
   * 
   */
  private AddAchievementCode(fldName:string):object[]
  {
    let questObject = this._user.getQuestData()
    let returnBadgesArray = new Array();

    if (questObject.badges_acquired_fld !== "") //if badges_acquired_fld is not empty split the string joined by ';'
    {
      returnBadgesArray = questObject.badges_acquired_fld.split(';');
    }

    switch (fldName) 
    {
      case fldNames.cifcnt_fld:
        switch (questObject[fldNames.cifcnt_fld]) 
        {
          case ControlForAddingPoints.BRONZE:
            returnBadgesArray.push('QC001')
            return returnBadgesArray //Rising Idol : Write 10 comments on forum section
          case ControlForAddingPoints.SILVER:
            returnBadgesArray.push('QC002')
            return returnBadgesArray //Dazzling Idol : Write 50 comments on forum section
          case ControlForAddingPoints.GOLD:
            returnBadgesArray.push('QC003')
            return returnBadgesArray //Charming Idol : Write 100 comments on forum section
          case ControlForAddingPoints.PLATINUM:
            returnBadgesArray.push('QC004')
            return returnBadgesArray //Fantastic Idol : Write 150 comments on forum section
          default:
            break;
        }
        break;

      case fldNames.piccnt_fld:
        switch (questObject[fldNames.piccnt_fld]) 
        {
          case ControlForAddingPoints.BRONZE:
            returnBadgesArray.push('QC005')
            return returnBadgesArray //Social : Write 10 posts in class.
          case ControlForAddingPoints.SILVER:
            returnBadgesArray.push('QC006')
            return returnBadgesArray //Socializer : Write 50 posts in class.
          case ControlForAddingPoints.GOLD:
            returnBadgesArray.push('QC007')
            return returnBadgesArray //Better Socializer : Write 100 posts in class.
          case ControlForAddingPoints.PLATINUM:
            returnBadgesArray.push('QC008')
            return returnBadgesArray //Best Socializer : Write 150 posts in class.
          default:
            break;
        }
        break;
      
      case fldNames.ciccnt_fld:
        switch (questObject[fldNames.ciccnt_fld]) 
        {
          case ControlForAddingPoints.BRONZE:
            returnBadgesArray.push('QC009')
            return returnBadgesArray //Active Student : Write 10 comments in CLASSES section
          case ControlForAddingPoints.SILVER:
            returnBadgesArray.push('QC010')
            return returnBadgesArray // Lively Student : Write 50 comments in CLASSES section
          case ControlForAddingPoints.GOLD:
            returnBadgesArray.push('QC011')
            return returnBadgesArray //Operative Student : Write 100 comments in CLASSES section
          case ControlForAddingPoints.PLATINUM:
            returnBadgesArray.push('QC012')
            return returnBadgesArray //Bubbly Student : Write 150 comments in CLASSES section
          default:
            break;
        }
        break;
      
      case fldNames.taskcnt_fld:
        switch (questObject[fldNames.taskcnt_fld]) 
        {
          case ControlForAddingPoints.BRONZE:
            returnBadgesArray.push('QC013')
            return returnBadgesArray //Task Finisher : Complete 10 TASKS
          case ControlForAddingPoints.SILVER:
            returnBadgesArray.push('QC014')
            return returnBadgesArray //Task Crusher : Complete 50 TASKS
          case ControlForAddingPoints.GOLD:
            returnBadgesArray.push('QC015')
            return returnBadgesArray //Task Topper : Complete 100 TASKS
          case ControlForAddingPoints.PLATINUM:
            returnBadgesArray.push('QC016')
            return returnBadgesArray //Task Clincher : Complete 150 TASKS
          default:
            break;
        }
        break;
      
      case fldNames.class_on_time_fld:
        switch (questObject[fldNames.class_on_time_fld]) 
        {
          case ControlForAddingPoints.BRONZE:
            returnBadgesArray.push('QC017')
            return returnBadgesArray //Hardworking Student : Attend 10 CLASSES
          case ControlForAddingPoints.SILVER:
            returnBadgesArray.push('QC018')
            return returnBadgesArray //Frequent : Attend 50 CLASSES
          case ControlForAddingPoints.GOLD:
            returnBadgesArray.push('QC019')
            return returnBadgesArray //Time Manager : Attend 100 CLASSES
          case ControlForAddingPoints.PLATINUM:
            returnBadgesArray.push('QC020')
            return returnBadgesArray //Clock Puncher : Attend 150 CLASSES
          default:
            break;
        }
        break;
        
      default:
        break;
    }
  }

  /**
   * This method is for Inserting badges to the database
   * 
   * @param badgesAcquired 
   */
  private InsertBadges(badgesAcquired)
  {
    try {
      let badgesAcquiredToString:string = '';
      if (badgesAcquired.length === 1) 
      { //If it is the first badge acquired convert to string : join the arraylist with ';'
        badgesAcquiredToString = badgesAcquired.toString();
      }
      else
      {
        badgesAcquiredToString = badgesAcquired.join(';');
      }
      
      //Will be called only if there is an acquired badge
      this.SubmitToDatabase({badges_acquired_fld:badgesAcquiredToString});
      
    } catch (error) {
      throw new Error("Error");
    }
  }
}
