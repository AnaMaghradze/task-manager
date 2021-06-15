import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListComponent } from './list/list.component';
import { TaskComponent } from './task/task.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddItemFormComponent } from './add-item-form/add-item-form.component';
import { ModalComponent } from './modal/modal.component';
import { FilterComponent } from './filter/filter.component';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const components = [
  ListComponent,
  TaskComponent,
  SidebarComponent,
  AddItemFormComponent,
  ModalComponent,
  FilterComponent,
  LayoutComponent,
  PageNotFoundComponent
];

const modules = [
  CommonModule,
  BrowserModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class ComponentsModule {}