import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

export const SlideInOut = trigger('slideInOut', [
  state(
    'in',
    style({
      width: '300px',
    })
  ),
  state(
    'out',
    style({
      width: '40px',
    })
  ),
  transition('in => out', animate('1s ease-in-out')),
  transition('out => in', animate('1s ease-in-out')),
]);
