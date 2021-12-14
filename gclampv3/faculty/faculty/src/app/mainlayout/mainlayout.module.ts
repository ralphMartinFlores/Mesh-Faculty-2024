import { ViewStudentSumbmissionComponent } from './../modules/classes/view-activities/view-student-sumbmission/view-student-sumbmission.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MainlayoutRoutingModule } from './mainlayout-routing.module';
import { MainlayoutComponent } from './mainlayout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//DIRECTIVES AND PIPE
import { SharedModule } from '../shared/shared.module';
import { LinkifyPipe } from '../shared/pipes/linkify.pipe';

//COMPONENTS
import { ClassroomComponent } from '../modules/classes/classroom/classroom.component';
import { ClassesComponent } from '../modules/classes/classes.component';
import { NewsComponent } from '../modules/news/news.component';
import { ForumsComponent } from '../modules/forums/forums.component';
import { ClassfeedComponent } from '../modules/classes/classfeed/classfeed.component';
import { ActivitiesComponent } from '../modules/classes/activities/activities.component';
import { MembersComponent } from '../modules/classes/members/members.component';
import { SummaryComponent } from '../modules/classes/summary/summary.component';
import { ViewActivitiesComponent } from '../modules/classes/view-activities/view-activities.component';
import { NewscontentComponent } from '../modules/news/newscontent/newscontent.component';
import { SubforumsComponent } from '../modules/forums/subforums/subforums.component';
import { MessagingComponent } from '../modules/messaging/messaging.component';
import { CRUDForumsComponent } from '../shared/components/crud-forums/crud-forums.component';
import { ViewDataOnlyComponent } from '../shared/components/view-data-only/view-data-only.component';
import { CRUDClassAndActivitiesComponent } from '../shared/components/crud-class-and-activities/crud-class-and-activities.component';
import { QuizCreatorComponent } from '../modules/classes/quiz-creator/quiz-creator.component';
import { CrudCommentsComponent } from '../shared/components/crud-comments/crud-comments.component';
import { ForumscontentComponent } from '../modules/forums/forumscontent/forumscontent.component';
import { CrudActivityComponent } from '../shared/components/crud-activity/crud-activity.component';
import { CrudQuizComponent } from '../shared/components/crud-quiz/crud-quiz.component';
import { CrudResourcesComponent } from '../shared/components/crud-resources/crud-resources.component';
import { CrudTopicComponent } from '../shared/components/crud-topic/crud-topic.component';
import { CrudForumsCommentsComponent } from '../shared/components/crud-forums-comments/crud-forums-comments.component';
import { FilesbottomsheetComponent } from '../shared/components/filesbottomsheet/filesbottomsheet.component';
import { CrudPostComponent } from '../shared/components/crud-post/crud-post.component';
import { StudentworksComponent } from '../shared/components/studentworks/studentworks.component';
import { CrudSubforumsComponent } from '../shared/components/crud-subforums/crud-subforums.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { CrudNewsCommentsComponent } from '../shared/components/crud-news-comments/crud-news-comments.component';
import { ChangepasswordComponent } from '../shared/components/changepassword/changepassword.component';
import { UpdateProfileComponent } from '../shared/components/update-profile/update-profile.component';
import { AddstudentComponent } from '../shared/components/addstudent/addstudent.component';
import { DeleteRecordComponent } from '../shared/components/delete-record/delete-record.component';
import { LoadingscreenComponent } from '../shared/components/loadingscreen/loadingscreen.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UpdateProfilePictureComponent } from '../shared/components/update-profile-picture/update-profile-picture.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FacultyLoadingComponent } from '../modules/faculty-loading/faculty-loading.component';
import { FileDownloadsComponent } from '../modules/file-downloads/file-downloads.component';
import { LibraryComponent } from '../modules/library/library.component';
import { EvaluationComponent } from '../modules/evaluation/evaluation.component';
import { QuestionnaireComponent } from '../modules/questionnaire/questionnaire.component';
import { SurveyComponent } from '../modules/survey/survey.component';
import { MeetingListComponent } from '../modules/classes/meeting-list/meeting-list/meeting-list.component';
import { SchedMeetingComponent } from '../modules/classes/sched-meeting/sched-meeting/sched-meeting.component';
@NgModule({
  declarations: [
    MainlayoutComponent,
    LinkifyPipe,
    ClassesComponent,
    NewsComponent,
    ForumsComponent,
    ClassroomComponent,
    ClassfeedComponent,
    ActivitiesComponent,
    MembersComponent,
    SummaryComponent,
    ViewActivitiesComponent,
    NewscontentComponent,
    SubforumsComponent,
    MessagingComponent,
    CRUDForumsComponent,
    CRUDClassAndActivitiesComponent,
    CrudCommentsComponent,
    MeetingListComponent,
    SchedMeetingComponent,
    ViewDataOnlyComponent,
    QuizCreatorComponent,
    ForumscontentComponent,
    CrudActivityComponent,
    CrudResourcesComponent,
    CrudTopicComponent,
    CrudQuizComponent,
    CrudForumsCommentsComponent,
    CrudSubforumsComponent,
    CrudCommentsComponent,
    FilesbottomsheetComponent,
    CrudPostComponent,
    StudentworksComponent,
    ProfileComponent,
    CrudNewsCommentsComponent,
    ChangepasswordComponent,
    UpdateProfileComponent,
    AddstudentComponent,
    ForumscontentComponent,
    DeleteRecordComponent,
    LoadingscreenComponent,
    ViewStudentSumbmissionComponent,
    UpdateProfilePictureComponent,
    FacultyLoadingComponent,
    FileDownloadsComponent,
    LibraryComponent,
    EvaluationComponent,
    QuestionnaireComponent,
    SurveyComponent
  ],
  imports: [
    CommonModule,
    MainlayoutRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    ImageCropperModule
  ],
  providers: [DatePipe,],
})
export class MainlayoutModule { }
