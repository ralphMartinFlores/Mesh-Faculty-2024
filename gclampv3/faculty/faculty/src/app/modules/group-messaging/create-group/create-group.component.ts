import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    name: new FormControl(''),
    classcode: new FormControl(''),
    participants: new FormControl(''),
  });
  studentList: any[] = [];

  constructor(public data: DataService, public user: UserService) { }

  ngOnInit(): void {
    this.initializeComponents()
  }

  initializeComponents() {
    this.studentList = this.user.getClassMembers().student
    console.log(this.studentList)
    const { classcode_fld, email_fld } = this.user.getClassroomInfo()
    this.groupLeader = this.splitEmail(email_fld)
    this.groupChatForm.get('classcode').setValue(classcode_fld)
  }
  
  splitEmail(email) {
    const arr = email.split('@')
    return arr[0]
  }

  onSubmitForm(event, load) {
    event.preventDefault()

    this.createGroup(load)
  }

  createGroup(load) {
    const participants = `${this.groupLeader}, ${this.groupChatForm.get('participants').value.join(', ')}`
    const roomid = this.genRoomId()
    const { name, classcode } = load

    const data = {
      groupname_fld: name,
      classcode_fld: classcode,
      participants_fld: participants,
      roomid_fld: roomid
    }

    this.data._httpRequest("creategroup/", data, 5).subscribe(res => {
      let dt = this.user._decrypt(res.a)
      // DO SOMETHING
      if (dt.status === 'success') {
        // this.router.navigate(['/groups'])
      }
    }, (err) =>{
      // this.errorMessage = err.error.message;
    })
  }

  genRoomId(): string {
    return uuidV4();
  }
}
