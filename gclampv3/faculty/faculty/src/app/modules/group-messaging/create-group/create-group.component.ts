import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { v4 as uuidV4 } from 'uuid';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  public groupLeader: string = ''
  public groupChatForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    classcode: new FormControl(''),
    participants: new FormControl('', [Validators.required]),
  });
  studentList: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    public data: DataService, public user: UserService) { }

  ngOnInit(): void {
    this.initializeComponents()
  }

  initializeComponents() {
    this.studentList = this.user.getClassMembers().student
    const { classcode_fld, email_fld } = this.user.getClassroomInfo()
    this.groupLeader = this.splitEmail(email_fld)
    this.groupChatForm.get('classcode').setValue(classcode_fld)
  }
  
  splitEmail(email) {
    const arr = email.split('@')
    return arr[0]
  }

  isOptionDisabled(opt: any) {
    return this.groupChatForm.value.participants.length >= 4 && !this.groupChatForm.value.participants.includes(opt)
  }

  onSubmitForm(event, load) {
    event.preventDefault()

    if (this.groupChatForm.valid) {
      this.createGroup(load)
    }
  }

  createGroup(groupinfo) {
    const participants = `${this.groupLeader}, ${this.groupChatForm.get('participants').value.join(', ')}`
    const roomid = this.genRoomId()
    const { name, classcode } = groupinfo

    const data = {
        groupname_fld: name,
        roomid_fld: roomid,
        classcode_fld: classcode,
        participants_fld: participants
    }

    this.data._httpRequest("addgrpchat/", data, 1).subscribe(res => {
      let dt = this.user._decrypt(res.a)
      // DO SOMETHING
      if (dt.status.remarks === 'success') {
        this.dialogRef.close()
      }
    }, (err) =>{
      // this.errorMessage = err.error.message;
    })
  }

  genRoomId(): string {
    return uuidV4();
  }
}
