import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() list: string[] = [];
  @Output() onSelect = new EventEmitter();
  selected = 'All';
  dropped = false;

  toggleDropdown() {
    this.dropped = !this.dropped;
  }

  select(li: any) {
    this.onSelect.emit(li);
    this.selected = li;
  }
}
