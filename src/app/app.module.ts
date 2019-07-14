import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from "@angular/router";
import { GoogleChartsModule } from 'angular-google-charts';

import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from './header/header.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { DataEntryComponent, DataEntryEditDialog, DataEntryDeleteConfirmDialog } from './data-entry/data-entry.component';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HttpHelperService } from './httphelper/http-helper.service';

const routes: Routes = [
  {
    path: "",
    component: DataEntryComponent
  },
  {
    path: "visualization",
    component: VisualizationComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DataEntryComponent,
    VisualizationComponent,
    DataEntryEditDialog,
    DataEntryDeleteConfirmDialog
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes, { enableTracing: false }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    GoogleChartsModule.forRoot(),
    MatSnackBarModule
  ],
  providers: [HttpHelperService],
  entryComponents: [DataEntryEditDialog, DataEntryDeleteConfirmDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
