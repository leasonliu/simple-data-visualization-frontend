import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpHelperService } from '../httphelper/http-helper.service';

export interface ActivityElement {
  id: number;
  position: number;
  activity: string;
  duration: number;
}

let ELEMENT_DATA: ActivityElement[] = [];

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {

  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar, private httpHelper: HttpHelperService) { }

  ngOnInit() {
    this.getDataEntry();
  }
  displayedColumns: string[] = ['select', 'position', 'activity', 'duration', 'edit'];

  selection = new SelectionModel<ActivityElement>(true, []);
  dataSource = new MatTableDataSource<ActivityElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  getDataEntry() {
    this.httpHelper.get("data").subscribe((data: ActivityElement[]) => {
      // console.log(data);
      ELEMENT_DATA = data;
      this.dataSource = new MatTableDataSource<ActivityElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ActivityElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(element?): void {
    const dialogRef = this.dialog.open(DataEntryEditDialog, {
      width: '250px',
      data: element ? { position: element.position, name: element.name, activity: element.activity, duration: element.duration } : { position: this.dataSource.data[this.dataSource.data.length - 1].position + 1 }
    });

    dialogRef.afterClosed().subscribe((result: ActivityElement) => {
      // console.log('The dialog was closed');
      if (result != undefined) {
        if (element) { // edit
          ELEMENT_DATA[element.position - 1] = result;
          this.openSnackBar('Successfully Edited');
          this.dataSource.data = ELEMENT_DATA;
        } else { // add
          ELEMENT_DATA.push(result);
          this.openSnackBar('Successfully Added');
          this.dataSource.data = ELEMENT_DATA;
        }
      }
    }, (err) => {
      console.error(err);
      this.openSnackBar('Failed!');
    });
  }

  add() {
    this.openDialog();
  }

  edit(event, element?): void {
    // console.log(element);
    event.stopPropagation();
    this.openDialog(element);
  }

  delete(selection: SelectionModel<ActivityElement>) {
    // console.log(selection.selected);
    const dialogRef = this.dialog.open(DataEntryDeleteConfirmDialog, {
      width: '250px',
      data: selection.selected,
      role: 'alertdialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      if (result) {
        ELEMENT_DATA = ELEMENT_DATA.filter(element => {
          return !this.selection.selected.includes(element);
        })
        this.dataSource._updatePaginator(ELEMENT_DATA.length);
        this.dataSource = new MatTableDataSource<ActivityElement>(ELEMENT_DATA);
        this.selection.clear();
        this.openSnackBar('Successfully Deleted');
      }
    });
  }

  openSnackBar(message: string, action: string = 'Ok') {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

@Component({
  selector: 'data-entry-edit-dialog.component',
  templateUrl: 'data-entry-edit-dialog.component.html',
})
export class DataEntryEditDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DataEntryEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityElement, private fb: FormBuilder, private httpHelper: HttpHelperService) { }

  isEditing = true;
  form: FormGroup = this.fb.group({
    activity: [
      this.data.activity, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
      ]
    ],
    duration: [
      this.data.duration, [
        Validators.required,
        Validators.pattern("^([1-9][0-9]*)+(.[0-9]{1})?$")
      ]
    ]
  })

  ngOnInit() {
    this.isEditing = this.data.activity ? true : false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    // console.log(this.form.controls['activity'].valid);
    // console.log(this.form.controls['duration'].valid);
    if (this.form.controls['activity'].valid && this.form.controls['duration'].valid) {
      this.pushToServer();
      this.dialogRef.close(this.data);
    } else {
      this.form.updateValueAndValidity();
    }
  }

  pushToServer() {
    let body = new FormData();
    body.append("position", this.data.position + '');
    body.append("activity", this.data.activity);
    body.append("duration", this.data.duration + '');
    if (this.isEditing) { // put
      this.httpHelper.put("data", body).subscribe((res) => {
        // console.log(res);
        this.dialogRef.close(this.data);
      }, err => {
        console.error(err);
      });
    } else { // post
      this.httpHelper.post("data", body).subscribe((res) => {
        console.log(res);
        this.dialogRef.close(this.data);
      }, err => {
        console.error(err);
      });
    }
  }

}

@Component({
  selector: 'data-entry-delete-confirm-dialog.component',
  templateUrl: 'data-entry-delete-confirm-dialog.component.html',
})
export class DataEntryDeleteConfirmDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DataEntryEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityElement[], private httpHelper: HttpHelperService) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    this.deleteFromServer();
  }

  deleteFromServer() {
    let count = 0;
    let eleSuc = [];
    this.data.forEach(element => {
      this.httpHelper.SendDeleteRequest("data?position=" + element.position).subscribe(res => {
        count++;
        eleSuc.push(element);
        console.log(res);
        if (count === this.data.length) {
          this.dialogRef.close(eleSuc);
        }
      }, err => {
        count++;
        console.error(err);
        if (count === this.data.length) {
          this.dialogRef.close(eleSuc);
        }
      });
    });
  }
}