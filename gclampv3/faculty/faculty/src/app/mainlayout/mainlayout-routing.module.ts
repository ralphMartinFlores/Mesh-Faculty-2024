import { ViewStudentSumbmissionComponent } from './../modules/classes/view-activities/view-student-sumbmission/view-student-sumbmission.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesComponent } from '../modules/classes/classes.component';
import { ClassroomComponent } from '../modules/classes/classroom/classroom.component';
import { QuizCreatorComponent } from '../modules/classes/quiz-creator/quiz-creator.component';
import { ViewActivitiesComponent } from '../modules/classes/view-activities/view-activities.component';
import { ForumsComponent } from '../modules/forums/forums.component';
import { ForumscontentComponent } from '../modules/forums/forumscontent/forumscontent.component';
import { SubforumsComponent } from '../modules/forums/subforums/subforums.component';
import { MessagingComponent } from '../modules/messaging/messaging.component';
import { NewsComponent } from '../modules/news/news.component';
import { NewscontentComponent } from '../modules/news/newscontent/newscontent.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { FacultyLoadingComponent } from '../modules/faculty-loading/faculty-loading.component';
import { FileDownloadsComponent } from '../modules/file-downloads/file-downloads.component';
import { LibraryComponent } from '../modules/library/library.component';
import { EvaluationComponent } from '../modules/evaluation/evaluation.component';
import { QuestionnaireComponent } from '../modules/questionnaire/questionnaire.component';
import { SchedMeetingComponent } from '../modules/classes/sched-meeting/sched-meeting/sched-meeting.component';
import { CallComponent } from '../modules/call/call.component';

const routes: Routes = [
  { path: 'call', component: CallComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'classes/:id', component: ClassroomComponent },
  { path: 'classes/:id/:view', component: ViewActivitiesComponent },
  { path: 'classes/:id/:view/:sid', component: ViewStudentSumbmissionComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news/:id', component: NewscontentComponent },
  { path: 'forums', component: ForumsComponent },
  { path: 'forums/:id', component: SubforumsComponent },
  { path: 'forums/:id/:sid', component: ForumscontentComponent },
  { path: 'message', component: MessagingComponent },
  { path: 'quiz', component: QuizCreatorComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'facultyloading', component: FacultyLoadingComponent },
  { path: 'evaluation', component: EvaluationComponent },
  { path: 'questionnaire', component: QuestionnaireComponent },
  { path: 'downloads', component: FileDownloadsComponent },
  { path: 'elibrary', component: LibraryComponent },
  { path: 'meeting/:roomcode', component: SchedMeetingComponent },
  { path: '', redirectTo: 'classes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainlayoutRoutingModule { }
