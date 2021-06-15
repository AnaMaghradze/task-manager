import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SlideInOut } from 'src/app/shared/animations/slideInOut.animation';
import { ITask } from 'src/app/shared/interfaces/list.interface';
import { TaskManagerService } from 'src/app/shared/services/task-manager.service';

@Component({
  selector: 'app-add-item-form',
  templateUrl: './add-item-form.component.html',
  styleUrls: ['./add-item-form.component.scss'],
  animations: [SlideInOut],
})
export class AddItemFormComponent implements OnInit {
  @Input() placeholder = 'create new';
  @Output() formSubmitted = new EventEmitter();
  toggleInput = false;
  slide!: string;

  ngOnInit() {
    this.slide = 'out';
  }

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  toggleForm(e: any) {
    this.slide = this.slide === 'out' ? 'in' : 'out';
    setTimeout(() => {
      this.toggleInput = !this.toggleInput;
    }, 500);
  }

  onSubmit(value: any) {
    this.formSubmitted.emit(value);
    this.form.controls['name'].reset();
  }
}
