import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainlayoutComponent } from './mainlayout/mainlayout.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main',
    component: MainlayoutComponent,
    children:[{
      path:'',
      loadChildren: () => import('./mainlayout/mainlayout.module').then(m=>m.MainlayoutModule)
    }],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
