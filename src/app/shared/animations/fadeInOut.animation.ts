import {
    trigger,
    transition,
    style,
    animate,
    query,
    stagger,
  } from '@angular/animations';
  
  export const FadeInOut = trigger('fadeInOut', [
    transition('* <=> *', [
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          stagger('0.3s', animate('0.6s ease-out', style({ opacity: 1 }))),
        ],
        { optional: true }
      ),
      query(':leave', animate('0.1s', style({ opacity: 0 })), { optional: true }),
    ]),
  ]);