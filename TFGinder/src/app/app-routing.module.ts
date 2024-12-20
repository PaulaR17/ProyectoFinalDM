import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'professor-info',
    loadChildren: () => import('./professor-info/professor-info.module').then( m => m.ProfessorInfoPageModule)
  },
  {
    path: 'student-profile',
    loadChildren: () => import('./student-profile/student-profile.module').then( m => m.StudentProfilePageModule)
  },
  {
    path: 'match',
    loadChildren: () => import('./match/match.module').then( m => m.MatchPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'student-info',
    loadChildren: () => import('./student-info/student-info.module').then( m => m.StudentInfoPageModule)
  },
  {
    path: 'professor-profile',
    loadChildren: () => import('./professor-profile/professor-profile.module').then( m => m.ProfessorProfilePageModule)
  },
  {
    path: 'tfg-professor',
    loadChildren: () => import('./tfg-professor/tfg-professor.module').then( m => m.TFGProfessorPageModule)
  },
  {
    path: 'tfg-student',
    loadChildren: () => import('./tfg-student/tfg-student.module').then( m => m.TFGStudentPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
