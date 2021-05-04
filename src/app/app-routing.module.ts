import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageListComponent } from './images/image-list/image-list.component';
import { ImageComponent } from './images/image/image.component';
import { ImagesComponent } from './images/images.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'image/upload',
    pathMatch: 'full'
  },
  {
    path: 'image',
    component: ImagesComponent,
    children: [
      {
        path:'upload',
        component: ImageComponent //image/upload
      },
      {
        path: 'list',
        component: ImageListComponent //image/list
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
