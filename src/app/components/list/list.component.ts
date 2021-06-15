import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Output() listChosen = new EventEmitter();
  @Output() onConfig = new EventEmitter();
  @Input() isOpen : boolean | undefined = false;

  open(e: any){
    this.isOpen = true;
    this.listChosen.emit(e);
  }

  configureList(e: any){
    this.onConfig.emit(e);
  }
}
