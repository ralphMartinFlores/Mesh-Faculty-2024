import { animate, animateChild, group, query, stagger, style,state,
    transition,
    trigger,
    keyframes
  } from "@angular/animations";

  export let staggereffect =  // Trigger animation cards array
  trigger('cardAnimation', [
    // Transition from any state to any state
    transition('* => *', [
      // Initially the all cards are not visible
      query(':enter', style({ opacity: 0 }), { optional: true }),

      // Each card will appear sequentially with the delay of 300ms
      query(':enter', stagger('100ms', [
        animate('.4s ease-in-out', keyframes([
          style({ opacity: 0, transform: 'translateY(-8px) scale(0.6)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))]), { optional: true })
    ]),
  ])

  export let pluscard =   // Trigger animation for plus button
  trigger('plusAnimation', [

    // Transition from any state to any state
    transition('* => *', [
      query('.plus-card', style({ opacity: 0, transform: 'translateY(-40px)' })),
      query('.plus-card', stagger('500ms', [
        animate('300ms 1.1s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ])),
    ])
  ])