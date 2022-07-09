import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MessagesComponent } from '../components/Message/messages/messages.component';
import { QuestComponent } from '../components/quest/quest.component';
import { TodolistComponent } from '../components/todolist/todolist.component';
import { ClassComponent } from '../components/class/class.component';
import { ForumComponent } from '../components/forum/forum.component';
import { NewsComponent } from '../components/news/news.component';
import { NewContentComponent } from '../components/news/new-content/new-content.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { ClassroomComponent } from '../components/class/classroom/classroom.component';
import { ForumSubComponent } from '../components/forum/forum-sub/forum-sub.component';
import { ForumContentComponent } from '../components/forum/forum-content/forum-content.component';
import { ViewAssignComponent } from '../components/class/view-assign/view-assign.component';
import { FileDownloadsComponent } from '../components/file-downloads/file-downloads.component';
import { AuthGuard } from '../services/auth.guard';
import { EvaluationComponent } from '../components/evaluation/evaluation.component';
import { QuestionnaireComponent } from '../components/evaluation/questionnaire/questionnaire.component';
import { LibraryComponent } from '../components/library/library.component';
import { CallComponent } from '../components/call/call.component';

export const MainLayoutRoutes: Routes = [
  { path: '', redirectTo: 'todolist', pathMatch: 'full' },
  { path: 'todolist', canActivate: [AuthGuard],component: TodolistComponent },
  { path: 'classes', canActivate: [AuthGuard],component: ClassComponent },
  { path: 'classes/:id', canActivate: [AuthGuard],component: ClassroomComponent },
  { path: 'classes/:id/:view', canActivate: [AuthGuard],component: ViewAssignComponent },
  { path: 'news', canActivate: [AuthGuard],component: NewsComponent },
  { path: 'news/:id', canActivate: [AuthGuard],component: NewContentComponent },
  { path: 'messages', canActivate: [AuthGuard],component: MessagesComponent },
  { path: 'forum', canActivate: [AuthGuard],component: ForumComponent },
  { path: 'forum/:id', canActivate: [AuthGuard],component: ForumSubComponent },
  { path: 'forum/:id/:sid', canActivate: [AuthGuard],component: ForumContentComponent },
  { path: 'profile', canActivate: [AuthGuard],component: ProfileComponent },
  { path: 'quest', canActivate: [AuthGuard],component: QuestComponent },
  { path: 'downloads',canActivate: [AuthGuard], component: FileDownloadsComponent },
  { path: 'evaluation', component: EvaluationComponent },
  { path: 'questionnaire', component: QuestionnaireComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'call', canActivate: [AuthGuard],component: CallComponent }
]

@NgModule({
  imports: [RouterModule.forChild(MainLayoutRoutes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
