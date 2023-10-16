import { computed, defineComponent, ref, watch } from "vue";
import {
  Observable,
  of,
  map,
  first,
  interval,
  concatAll,
  Subject,
  from,
  multicast,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  observeOn,
  asyncScheduler,
  switchMap,
  fromEvent,
  mergeWith,
  mergeAll,
  scan,
  distinctUntilChanged,
  takeUntil,
  repeat,
} from "rxjs";
import { take } from "lodash";

export default defineComponent({
  setup() {
    // const observable = new Observable((subscriber) => {
    //   const id = setInterval(() => {
    //     subscriber.next("hi");
    //   }, 1000);
    //   return function unsubscribe() {
    //     clearInterval(id);
    //   };
    // });

    // const subscription = observable.subscribe((x) => {
    //   console.log(x);
    // });

    // subscription.unsubscribe();

    // of(1, 2, 3)
    //   .pipe(first())
    //   .subscribe((v) => console.log(v));

    // function delay<T>(delayInMillis: number) {
    //   return (observable: Observable<T>) => {
    //     return new Observable<T>((subscriber) => {
    //       const allTimerIds = new Set();
    //       let hasCompleted = false;
    //       const subscription = observable.subscribe({
    //         next(value) {
    //           const timerId = setTimeout(() => {
    //             subscriber.next(value);
    //             allTimerIds.delete(timerId);

    //             if (hasCompleted && allTimerIds.size == 0) {
    //               subscriber.complete();
    //             }
    //           }, delayInMillis);
    //           allTimerIds.add(timerId);
    //         },
    //         error(err) {
    //           subscriber.error(err);
    //         },
    //         complete() {
    //           hasCompleted = true;
    //           if (allTimerIds.size === 0) {
    //             subscriber.complete();
    //           }
    //         },
    //       });

    //       return () => {
    //         subscription.unsubscribe();
    //         for (const timerId of allTimerIds) {
    //           // @ts-ignore
    //           clearTimeout(timerId);
    //         }
    //       };
    //     });
    //   };
    // }

    // of(1, 2, 3).pipe(delay(3000)).subscribe(console.log);

    // const subject = new Subject<number>();

    // subject.subscribe({
    //   next: (v) => console.log(`subjectA: ${v}`),
    // });

    // subject.subscribe({
    //   next: (v) => console.log(`subjectB: ${v}`),
    // });

    // const observable = from([1, 2, 3]);

    // observable.subscribe(subject);

    // const subject = new BehaviorSubject(0);
    // subject.subscribe({
    //   next: (v) => console.log(`observerA: ${v}`),
    // });

    // subject.next(1);
    // subject.next(2);

    // subject.subscribe({
    //   next: (v) => console.log(`observerB: ${v}`),
    // });

    // subject.next(3);

    // const subject = new ReplaySubject(100, 500);

    // subject.subscribe({
    //   next: (v) => console.log(`observerA: ${v}`),
    // });

    // let i = 1;
    // setInterval(() => subject.next(i++), 200);

    // setTimeout(() => {
    //   subject.subscribe({
    //     next: (v) => console.log(`observerB: ${v}`),
    //   });
    // }, 1000);

    const btnRef = ref<HTMLDivElement>();
    watch(btnRef, () => {
      console.log("btnRef", btnRef.value);
      if (!btnRef.value) return;
      // const clicks = fromEvent(btnRef.value, "click");
      // const result = clicks.pipe(switchMap(() => interval(1000)));
      // result.subscribe(console.log);

      // const clicks = fromEvent<PointerEvent>(document, "click");
      // const positions = clicks.pipe(map((ev) => ev.clientX));

      // positions.subscribe(console.log);

      // const click$ = fromEvent(document, "click").pipe(map(() => "click"));
      // const mousemove$ =

      // of(1, 2, 3)
      //   .pipe(
      //     scan((total, n) => total + n),
      //     map((sum, index) => sum)
      //   )
      //   .subscribe(console.log);

      // of(1, 1, 1, 2, 2, 2, 1, 1, 3, 3)
      //   .pipe(distinctUntilChanged())
      //   .subscribe(console.log);

      of("Repeat message").pipe(repeat(3)).subscribe(console.log);
    });

    return () => {
      return <button ref={btnRef}>sss</button>;
    };
  },
});
