import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @Output() taskClicked = new EventEmitter(); 
  @Output() editClicked = new EventEmitter(); 
  @Output() deleteClicked = new EventEmitter();
  @Input() isDone = false;

  toggle (e: any){
    // allowedArea includes whole task area other than edit, delete buttons
    let allowedArea = !e.target.classList.contains('task-controllers');
    if(allowedArea){
      this.isDone = !this.isDone; // done or in progress
      this.taskClicked.emit(e);
    }
  }

  delete (e: any){
    this.deleteClicked.emit(e);
  }
}
