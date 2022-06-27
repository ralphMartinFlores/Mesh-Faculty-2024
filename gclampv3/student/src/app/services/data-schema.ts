import { ListOfAchievementTargets } from "./enum";

export class KeyImage {
    defaultimg: string = '';
    defaultMessage: string = 'AvengersRockzWithZontheRocks';
    generateHexString(len: any) {
      const hex = '0123456789abcdef';
      let output = '';
      for (let i = 0; i < len; ++i) {
          output += hex.charAt(Math.floor(Math.random() * hex.length));
      }
      return output;
    }
    
  }
  
  export class Haystack {
    generateString(len: any) {
      const vString = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let output = '';
      for (let i = 0; i < len; ++i) {
          output += vString.charAt(Math.floor(Math.random() * vString.length));
      }
      return output;
    }
  }

  export class AppConfig{
    public prefix: string
    public baseURL: string
    public fileUrl: string
    public imgURL: string
  }

  export class QuestDataItem{
    quest: any = [
      { questcode_fld: 'QC001', title_fld:'Rising Idol', target_fld: ListOfAchievementTargets.BRONZE,	questcontent_fld:'Write '+ ListOfAchievementTargets.BRONZE +' comments on forum section',filedir_fld: 'assets/badges/rising_idol.png' },
      { questcode_fld: 'QC002', title_fld:'Dazzling Idol', target_fld: ListOfAchievementTargets.SILVER,	questcontent_fld:'Write '+ ListOfAchievementTargets.SILVER +' comments on forum section',filedir_fld: 'assets/badges/dazzling_idol.png'},
      { questcode_fld: 'QC003', title_fld: 'Charming Idol',target_fld: ListOfAchievementTargets.GOLD, questcontent_fld:'Write '+ ListOfAchievementTargets.GOLD +' comment on forum section', filedir_fld:'assets/badges/charming_idol.png'},
      { questcode_fld: 'QC004', title_fld: 'Fantastic Idol',target_fld: ListOfAchievementTargets.PLATINUM,questcontent_fld: 'Write '+ListOfAchievementTargets.PLATINUM+' comment on forum section',filedir_fld: 'assets/badges/fantastic_idol.png'},
      { questcode_fld: 'QC005', title_fld: 'Social',target_fld: ListOfAchievementTargets.BRONZE,questcontent_fld: 'Write '+ListOfAchievementTargets.BRONZE+' posts in class.', filedir_fld:'assets/badges/badge.png'},
      { questcode_fld: 'QC006', title_fld: 'Socializer',target_fld: ListOfAchievementTargets.SILVER,questcontent_fld: 'Write '+ListOfAchievementTargets.SILVER+' posts in class.',filedir_fld: 'assets/badges/badge.png'},
      { questcode_fld: 'QC007', title_fld: 'Better Socializer',target_fld: ListOfAchievementTargets.GOLD,questcontent_fld: 'Write '+ListOfAchievementTargets.GOLD+' posts in class.', filedir_fld:'assets/badges/badge.png'},
      { questcode_fld: 'QC008', title_fld: 'Best Socializer',target_fld: ListOfAchievementTargets.PLATINUM,questcontent_fld: 'Write '+ListOfAchievementTargets.PLATINUM+' posts in class.', filedir_fld:'assets/badges/badge.png'},
      { questcode_fld: 'QC009', title_fld: 'Active Classmate',target_fld: ListOfAchievementTargets.BRONZE,questcontent_fld: 'Write '+ListOfAchievementTargets.BRONZE+' comment in CLASSES section',filedir_fld: 'assets/badges/active_classmate.png'},
      { questcode_fld: 'QC010', title_fld: 'Lively Buddy',target_fld: ListOfAchievementTargets.SILVER,questcontent_fld: 'Write '+ListOfAchievementTargets.SILVER+' comments in CLASSES section',filedir_fld: 'assets/badges/lively_buddy.png'},
      { questcode_fld: 'QC011', title_fld: 'Cooperative Student',target_fld: ListOfAchievementTargets.GOLD,questcontent_fld: 'Write '+ListOfAchievementTargets.GOLD+' comments in CLASSES section',filedir_fld: 'assets/badges/cooperative_mate.png'},
      { questcode_fld: 'QC012', title_fld: 'Bubbly Student',target_fld: ListOfAchievementTargets.PLATINUM,questcontent_fld: 'Write '+ListOfAchievementTargets.PLATINUM+' comments in CLASSES section',filedir_fld: 'assets/badges/bubbly_student.png'},
      { questcode_fld: 'QC013', title_fld: 'Task Finisher',target_fld: ListOfAchievementTargets.BRONZE,questcontent_fld: 'Complete '+ListOfAchievementTargets.BRONZE+' TASKS',filedir_fld: 'assets/badges/task_finisher.png'},
      { questcode_fld: 'QC014', title_fld: 'Task Crusher',target_fld: ListOfAchievementTargets.SILVER,questcontent_fld: 'Complete '+ListOfAchievementTargets.SILVER+' TASKS',filedir_fld: 'assets/badges/task_crusher.png'},
      { questcode_fld: 'QC015', title_fld: 'Task Topper',target_fld: ListOfAchievementTargets.GOLD,questcontent_fld: 'Complete '+ListOfAchievementTargets.GOLD+' TASKS', filedir_fld:'assets/badges/task_topper.png'},
      { questcode_fld: 'QC016', title_fld: 'Task Clincher',target_fld: ListOfAchievementTargets.PLATINUM, questcontent_fld:'Complete '+ListOfAchievementTargets.PLATINUM+' TASKS', filedir_fld:'assets/badges/task_clincher.png'},
      { questcode_fld: 'QC017', title_fld: 'Hardworking Student',target_fld: ListOfAchievementTargets.BRONZE,questcontent_fld: 'Attend '+ ListOfAchievementTargets.BRONZE +' CLASSES',filedir_fld: 'assets/badges/working_one.png'},
      { questcode_fld: 'QC018', title_fld: 'Frequent',target_fld: ListOfAchievementTargets.SILVER,questcontent_fld: 'Attend '+ ListOfAchievementTargets.SILVER +' CLASSES',filedir_fld: 'assets/badges/hardworking_one.png'},
      { questcode_fld: 'QC019', title_fld: 'Time Manager',target_fld: ListOfAchievementTargets.GOLD,questcontent_fld: 'Attend '+ ListOfAchievementTargets.GOLD +' CLASSES',filedir_fld: 'assets/badges/time_manager.png'},
      { questcode_fld: 'QC020', title_fld: 'Clock Puncher',target_fld: ListOfAchievementTargets.PLATINUM,questcontent_fld: 'Attend '+ListOfAchievementTargets.PLATINUM+' CLASSES',filedir_fld: 'assets/badges/clock_puncher_plat.png'}
    ];
  }

  export class ShopItems {
    shopItems:any = [
      { itemcode_fld: 'SI001', title_fld:'title 1', cost_fld:'2', description_fld: 'description 1'},
      { itemcode_fld: 'SI002', title_fld:'title 2', cost_fld:'2', description_fld: 'description 2'},
      { itemcode_fld: 'SI003', title_fld:'title 3', cost_fld:'2', description_fld: 'description 3'},
      { itemcode_fld: 'SI004', title_fld:'title 4', cost_fld:'2', description_fld: 'description 4'}
    ]
  }