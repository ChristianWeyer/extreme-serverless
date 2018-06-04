import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'tcc-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css'],
})
export class DialogUserComponent {
  public formGroup: FormGroup;
  public previousUsername: string;

  constructor(
    public dialogRef: MatDialogRef<DialogUserComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public params: any,
  ) {
    this.createForm();
    this.previousUsername = params.username ? params.username : '';
  }

  public onSave(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.dialogRef.close({
      username: this.params.username,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername,
    });
  }

  private createForm() {
    this.formGroup = this._formBuilder.group({
      username: [this.previousUsername, Validators.required],
    });
  }
}
