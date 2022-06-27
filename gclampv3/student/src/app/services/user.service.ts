import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataService } from './data.service';
import * as CryptoJS from 'crypto-js';
import { KeyImage, Haystack } from './data-schema';
import aes from 'crypto-js/aes';
import encHex from 'crypto-js/enc-hex';
import padZeroPadding from 'crypto-js/pad-zeropadding';
import { version } from 'package.json';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  loadinginput: boolean;

  setLoginState(): void {
    window.sessionStorage.setItem('StudentLogState', 'true');
  }
  getLoginState(): string {
    return window.sessionStorage.getItem('StudentLogState');
  }


  setSettings(data): void { this.setData('settings', data) }
  getSettings(): any { return this.extractData('settings') }
  getAcadYear(): string { return this.extractData('settings').acadyear_fld }
  getSemester(): string { return this.extractData('settings').sem_fld }




  setData(label, value): void {
    let haystack = new Haystack();
    window.sessionStorage.setItem(btoa(label), haystack.generateString(17) + btoa(unescape(encodeURIComponent(JSON.stringify(value)))));
  }

  public url: string = "https://gordoncollegeccs.edu.ph/api-gcatweb/"
  private loading: boolean = false
  public version: string = version;

  constructor(private _deviceService: DeviceDetectorService) {
  }



  getDateToday(): string {
    let dt = new Date();
    let mt = '';
    let day = '';
    let hours = '';
    let min = '';
    let seconds = '';

    if ((dt.getMonth() + 1) < 10) {
      mt = '0' + (dt.getMonth() + 1).toString();
    } else {
      mt = (dt.getMonth() + 1).toString();
    }

    if ((dt.getDate()) < 10) {
      day = '0' + (dt.getDate()).toString();
    } else {
      day = (dt.getDate()).toString();
    }

    if ((dt.getSeconds()) < 10) {
      seconds = '0' + (dt.getSeconds()).toString();
    } else {
      seconds = (dt.getSeconds()).toString();
    }

    if ((dt.getHours()) < 10) {
      hours = '0' + (dt.getHours()).toString();
    } else {
      hours = (dt.getHours()).toString();
    }

    if ((dt.getMinutes()) < 10) {
      min = '0' + (dt.getMinutes()).toString();
    } else {
      min = (dt.getMinutes()).toString();
    }
    let datestring = dt.getFullYear().toString() + "-" + mt + "-" + day + " " + hours + ":" + min + ":" + seconds;
    return datestring;
  }

  setUserData(data): void { this.setData('studentuser', data) }
  getUserData(): any { this.extractData('studentuser') }

  updateUserData(value,sessionKey:String) {
    let prevData = this.extractData(sessionKey);
    Object.keys(value).forEach((val) => {
      prevData[val] = value[val];
    })
    this.setData(sessionKey, prevData);
  }

  setContentNews(data) { this.setData('contentnews', data) }
  getContentNews() { return this.extractData('contentnews') }

  setQuestData(data) { this.setData('questsdata', data) }
  getQuestData() { return this.extractData('questsdata') }


  setQuest(data) { this.setData('quests', data) }
  getQuest() { return this.extractData('quests') }

  setTeachers(data) { this.setData('teacher', data) }
  getTeachers() { return this.extractData('teacher') }

  setAssign(data) { this.setData('assign', data) }
  getAssign() { return this.extractData('assign') }

  setStudents(data) { this.setData('students', data) }
  getStudents() { return this.extractData('students') }

  setResources(data) { this.setData('res', data) }
  getResources() { return this.extractData('res') }

  setTopic(data) { this.setData('topic', data) }
  getTopic() { return this.extractData('topic') }

  setActivity(data) { this.setData('activity', data) }
  getActivity() { return this.extractData('activity') }

  setPosts(data) { this.setData('posts', data) }
  getPosts() { return this.extractData('posts') }

  setSelectedClass(data) { this.setData('selectedclass', data) }
  getSelectedClass() { return this.extractData('selectedclass') }

  setStudentProfile(data): void { this.setData('profile', data) }
  getStudentProfile(): string { return this.extractData('profile') }

  setStudentSchedule(data): void { this.setData('schedule', data) }
  getStudentSchedule(): string { return this.extractData('schedule') }

  setProfilePicture(data): void { this.setData('picture', data) }
  getProfilePicture(): string { return this.extractData('picture') }

  setMessageBadge(num) { window.sessionStorage.setItem('msgnum', num) }
  getMessageBadge(): any { return window.sessionStorage.getItem('msgnum') }

  isLoading(): boolean { return this.loading }
  setLoading(loadingStatus: boolean) { this.loading = loadingStatus }

  isLoadingInput(): boolean { return this.loadinginput }
  setLoadingInput(loadingInputStatus: boolean) { this.loadinginput = loadingInputStatus }

  getext(data) {
    return data.split('.').pop();
  }



  getProfilePic(): string { return this.extractData('studentuser').img }
  getFolderID(): string { return this.extractData('studentuser').folderid }
  getFullname(): string { return this.extractData('studentuser').fullname }
  getUserID(): string { return this.extractData('studentuser').id }
  getDepartment(): string { return this.extractData('studentuser').dept }
  getToken(): string { return this.extractData('studentuser').key; }
  getRole(): number { return this.extractData('studentuser').role }
  getProgram(): string { return this.extractData('studentuser').program }
  getEmail(): string { return this.extractData('studentuser').emailadd }
  getForumRole(): string { return this.extractData('studentuser').forumrole }
  getIsCovax(): number { return parseInt(this.extractData('studentuser').iscovax) }
  getCovaxType(): number { return parseInt(this.extractData('studentuser').covaxtype) }
  getNoCovaxReason(): string { return this.extractData('studentuser').nocovaxreason }
  getIsSurvey(): number { return parseInt(this.extractData('studentuser').issurvey) }




  private extractData(data): any {
    let text: string = window.sessionStorage.getItem(btoa(data)).substr(17);
    return JSON.parse(decodeURIComponent(escape(atob(text))));
    // return JSON.parse(atob(window.sessionStorage.getItem(btoa('studentuser'))));
  }
  // ./User related variables and methods

  // System-wide related variables and methods
  private key = new KeyImage();
  isMobile(): any { return this._deviceService.isMobile(); }

  // Start Encryption Front-end Related
  _decrypt(encryptedString) {
    var key = this.key.defaultMessage;
    var encryptMethod = 'AES-256-CBC';
    var encryptLength = parseInt(encryptMethod.match(/\d+/)[0]);
    var json = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString)));
    var salt = CryptoJS.enc.Hex.parse(json.salt);
    var iv = CryptoJS.enc.Hex.parse(json.iv);
    var encrypted = json.ciphertext;
    var iterations = parseInt(json.iterations);
    if (iterations <= 0) { iterations = 999; }
    var encryptMethodLength = encryptLength / 4;
    var hashKey = CryptoJS.PBKDF2(key, salt, { hasher: CryptoJS.algo.SHA512, keySize: encryptMethodLength / 8, iterations: iterations, });
    var decrypted = CryptoJS.AES.decrypt(encrypted, hashKey, { mode: CryptoJS.mode.CBC, iv: iv, });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

  }

  _convertmessage(msg) {
    let keyString = this.key.generateHexString(32);
    let ivString = this.key.generateHexString(32);
    let key = encHex.parse(keyString);
    let iv = encHex.parse(ivString);
    return btoa(this.key.generateHexString(11) + iv + key + aes.encrypt(msg, key, { iv: iv, padding: padZeroPadding }).toString());
  }

  // End Encryption Front-end Related


  //NEW SS BY OWEN:

  setMainForums(data) { this.setData('mainforum', data) }
  getMainForums() { return this.extractData('mainforum') }

  setSubForums(data) { this.setData('subforum', data) }
  getSubForums() { return this.extractData('subforum') }

}
