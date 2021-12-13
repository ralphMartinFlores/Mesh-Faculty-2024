import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';
import aes from 'crypto-js/aes';
import encHex from 'crypto-js/enc-hex';
import padZeroPadding from 'crypto-js/pad-zeropadding';
import { KeyImage, Haystack } from '../services/data.schema';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private key = new KeyImage();
  private loading = false;
  constructor(private _deviceService: DeviceDetectorService, private _snackBar: MatSnackBar) { }

  private files: any = [];

  private extractData(data): any {
    let text: string = window.sessionStorage.getItem(decodeURIComponent(escape(btoa(data)))).substr(17);
    return JSON.parse(atob(text));
  }

  setData(label, value): void {
    let haystack = new Haystack();
    window.sessionStorage.setItem(btoa(label), haystack.generateString(17) + btoa(unescape(encodeURIComponent(JSON.stringify(value)))));
  }

  openSnackBar(message: string, action: string, mili: number) {
    this._snackBar.open(message, action, {
      duration: mili,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      // panelClass: ['mat-toolbar', 'mat-primary'],
      panelClass: "success-dialog"

    });
  }

  setSelectedForum(data): void { this.setData('forumtopic', data) }
  getSelectedForum(): any { return this.extractData('forumtopic') }

  setSubSelectedForum(data): void { this.setData('subforumtopic', data) }
  getSubSelectedForum(): any { return this.extractData('subforumtopic') }

  setClassroomInfo(data): void { this.setData('classroom', data) }

  setMeetingInfo(data): void { this.setData('classroom', data) }

  getClassroomInfo(): any { return this.extractData('classroom') }

  setSettings(data): void { this.setData('settings', data) }
  getSettings(): any { return this.extractData('settings') }

  setActivityInfo(data): void { this.setData('activityinfo', data) }
  getActivityInfo(): any { return this.extractData('activityinfo') }

  setTopic(data): any { this.setData('topic', data) }
  getTopic(): void { return this.extractData('topic') }

  setViewSubmission(data): any { this.setData('submission', data) }
  getViewSubmission(): void { return this.extractData('submission') }

  setQuiz(data): any { this.setData('quiz', data) }
  getQuiz(): void { return this.extractData('quiz') }

  setNews(data): void { this.setData('news', data) }
  getNews(): any { return this.extractData('news') }

  setClassMembers(data): void { this.setData('classmembers', data) }
  getClassMembers(): any { return this.extractData('classmembers') }


  setSelectedTabIndex(index): void { window.sessionStorage.setItem('matindex', index) }
  getSelectedTabIndex(): any { return window.sessionStorage.getItem('matindex') }

  setMessageBadge(num) { window.sessionStorage.setItem('msgnum', num) }
  getMessageBadge(): any { return window.sessionStorage.getItem('msgnum') }

  setLoginState(data): void { this.setData('loginStateFaculty', data.toString()) }
  getLoginState(): any { return this.extractData('loginStateFaculty') }

  getUserImage(): string { return this.extractData('user').img }
  getUserID(): string { return this.extractData('user').id }
  getUserFullname(): string { return this.extractData('user').fullname }
  getUserEmail(): string { return this.extractData('user').emailadd }
  getUserKey(): string { return this.extractData('user').key }
  getUserRole(): string { return this.extractData('user').role }
  getUserDept(): string { return this.extractData('user').dept }
  getUserProgram(): string { return this.extractData('user').program }
  getIsCovax(): number { return parseInt(this.extractData('user').iscovax) }
  getCovaxType(): number { return parseInt(this.extractData('user').covaxtype) }
  getNoCovaxReason(): string { return this.extractData('user').nocovaxreason }

  getUserData(): any { return this.extractData('user') }

  isMobile(): any { return this._deviceService.isMobile(); }
  isLoading(): boolean { return this.loading }
  setLoading(loadingStatus: boolean) { this.loading = loadingStatus }

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

  updateUserData(value) {
    let prevData = this.extractData('user');
    Object.keys(value).forEach((val) => {
      prevData[val] = value[val];
    })
    this.setData('user', prevData);
    // this.image = prevData.img;
  }

}
