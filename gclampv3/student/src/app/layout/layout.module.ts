import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from '@angular/common';
import { MainLayoutRoutingModule } from './layout-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { LinkifyPipe } from '../pipes/url.pipe';

// components
import { LayoutComponent } from './layout.component';
import { ActivitiesComponent } from '../components/class/activities/activities.component';
import { StudentWorksComponent } from '../components/class/student-works/student-works.component';
import { MembersComponent } from '../components/class/members/members.component';
import { EvaluationComponent } from "../components/evaluation/evaluation.component";
import { QuestionnaireComponent } from '../components/evaluation/questionnaire/questionnaire.component';



//.component

//angular material
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MessagesComponent } from "../components/Message/messages/messages.component";
import { TodolistComponent } from "../components/todolist/todolist.component";
import { NewsComponent } from "../components/news/news.component";
import { NewContentComponent } from "../components/news/new-content/new-content.component";
import { QuestComponent } from '../components/quest/quest.component';
import { ClassComponent } from "../components/class/class.component";
import { ForumComponent } from "../components/forum/forum.component";
import { ProfileComponent } from "../components/profile/profile.component";
import { ClassroomComponent } from "../components/class/classroom/classroom.component";
import { ForumContentComponent } from "../components/forum/forum-content/forum-content.component";
import { ForumSubComponent } from "../components/forum/forum-sub/forum-sub.component";
import { DialogComponent } from "../shared/dialog/dialog.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import { ForumAddComponent } from '../components/forum/forum-add/forum-add.component';
import { ForumEditComponent } from '../components/forum/forum-edit/forum-edit.component';
import { NewsCommentsComponent } from '../components/news/news-comments/news-comments.component';
import { ResourcePreviewComponent } from '../shared/resource-preview/resource-preview.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import { LinkifyPipe } from '../classroom/linkify.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';

import {GridModule} from '@angular/flex-layout/grid';
import { ViewAssignComponent } from "../components/class/view-assign/view-assign.component";
import { ClassFeedComponent } from "../components/class/class-feed/class-feed.component";
import { PostCommentsComponent } from '../components/class/class-feed/post-comments/post-comments.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { ImagePreviewComponent } from "../shared/image-preview/image-preview.component";
//.angular material
// import { SharedModule } from "../shared/shared.module";
import { ViewQuizComponent } from "../components/class/view-quiz/view-quiz.component";
import { ViewScheduleModalComponent } from "../components/class/view-schedule-modal/view-schedule-modal.component";
import { UpdateProfileModalComponent } from '../components/profile/update-profile-modal/update-profile-modal.component';
import { PostsEditComponent } from "../shared/posts-edit/posts-edit.component";
import { LoadingscreenComponent } from "../shared/loadingscreen/loadingscreen.component";
import { ChangeProfilePictureComponent } from "../components/profile/change-profile-picture/change-profile-picture.component";
// import { FileDownloadsComponent } from "../components/file-downloads/file-downloads.component";
import { ImageCropperModule } from 'ngx-image-cropper';
import {MatBadgeModule} from '@angular/material/badge';
import { ClipboardModule } from "@angular/cdk/clipboard";
import { SurveyComponent } from "../shared/survey/survey.component";
import { LibraryComponent } from "../components/library/library.component";
import { GroupMessagingComponent } from "../components/group-messaging/group-messaging.component";
import { CallComponent } from "../components/call/call.component";
import { VideoPlayerComponent } from "../components/call/video-player/video-player.component";
import { CallSettingsComponent } from "../components/call/call-settings/call-settings.component";
import { ParticipantsDialogComponent } from "../components/call/participants-dialog/participants-dialog/participants-dialog.component";


@NgModule({
  imports: [
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MainLayoutRoutingModule,
    LayoutModule,
    MatMenuModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatSelectModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTableModule,
    FlexLayoutModule,
    GridModule,
    MatProgressBarModule,
    MatRadioModule,       
    // SharedModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    ImageCropperModule,
    MatBadgeModule,
    ClipboardModule,
    MatExpansionModule
  ],
  declarations: [
    LayoutComponent,
    MessagesComponent,
    ProfileComponent,
    TodolistComponent,
    NewsComponent,
    NewContentComponent,
    QuestComponent,
    ClassComponent,
    ClassroomComponent,
    ForumContentComponent,
    ForumSubComponent,
    ForumComponent,
    LinkifyPipe,
    DialogComponent, 
    ActivitiesComponent,
    StudentWorksComponent,
    MembersComponent, 
    ViewAssignComponent,
    ClassFeedComponent,
    PostCommentsComponent,
    // ImagePreviewComponent,
    ViewQuizComponent,
    ViewScheduleModalComponent,
    UpdateProfileModalComponent,
    PostsEditComponent,
    ForumAddComponent,
    ForumEditComponent,
    LoadingscreenComponent,
    NewsCommentsComponent,
    ResourcePreviewComponent,
    ChangeProfilePictureComponent,
    EvaluationComponent,
    QuestionnaireComponent,
    SurveyComponent,
    LibraryComponent,
    GroupMessagingComponent,
    CallComponent,
    VideoPlayerComponent,
    CallSettingsComponent,
    ParticipantsDialogComponent
    // FileDownloadsComponent
  ],
  providers: [DatePipe],
  entryComponents: []
})
export class MainLayoutModule { }
