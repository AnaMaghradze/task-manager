import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IList } from 'src/app/shared/interfaces/list.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() modalStyle: object = {};
  @Input() list: IList = { id: '', name: '', listGroupId: '' };
  @Output() onClose = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  updatedListName = "";

  close(e: any) {
    this.onClose.emit(e);
  }

  blur(e: any) {
    if (e.target.classList.contains('modal')) {
      this.onBlur.emit(e);
    }
  }

  onKey(e: any){
    this.updatedListName = e.target.value;
  }

  edit(e: any) {
    this.onEdit.emit({ value: e, updatedListName: this.updatedListName });
  }

  delete(e: any) {
    this.onDelete.emit(e);
  }
}
