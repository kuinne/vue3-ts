import {
  Observable,
  Subject,
  Subscriber,
  distinctUntilChanged,
  filter,
  forkJoin,
  from,
  fromEvent,
  map,
  mapTo,
  mergeAll,
  pipe,
  repeatWhen,
  retry,
  retryWhen,
  scan,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import * as SparkMD5 from "spark-md5";

const $attachment = document.querySelector(".attachment")!;
const $progressBar = document.querySelector(".progress-bar")! as HTMLElement;
const apiHost = "http://127.0.0.1:5000/api";

interface FileInfo {
  fileSize: number;
  fileMD5: string;
  lastUpdated: string;
  fileName: string;
}

interface ChunkMeta {
  fileSize: number;
  chunkSize: number;
  chunks: number;
  fileKey: string;
}

type Action = "pause" | "resume" | "progress" | "complete";

export class FileUploader {
  private file$ = fromEvent($attachment, "change").pipe(
    map((r: Event) => (r.target as HTMLInputElement)?.files?.[0]!)
  );

  private click$ = fromEvent($attachment, "click").pipe(
    map((e: Event) => e.target as HTMLElement),
    filter((e: HTMLElement) => e === $attachment),
    scan((acc: number, val: HTMLElement) => {
      if (val.classList.contains("glyphicon-paperclip")) {
        return 1;
      }
      if (acc === 2) {
        return 3;
      }

      return 2;
    }, 3),
    filter((v) => v !== 1),
    tap(
      (v) => {
        if (v === 2) {
          this.action$.next({ name: "pause" });
          $attachment.classList.remove("glyphicon-pause");
          $attachment.classList.add("glyphicon-play");
        } else {
          this.action$.next({ name: "resume" });
          this.buildPauseIcon();
        }
      },
      map((v) => ({ action: v === 2 ? "PAUSE" : "RESUME", payload: null }))
    )
  );

  private action$ = new Subject<{ name: Action; payload?: any }>();

  private pause$ = this.action$.pipe(filter((ac) => ac.name === "pause"));

  private resume$ = this.action$.pipe(filter((ac) => ac.name === "resume"));

  private progress$ = this.action$.pipe(
    filter((action) => action.name === "progress"),
    map((action) => action.payload),
    distinctUntilChanged((x: number, y: number) => x - y >= 0),
    tap(
      (r: number) => {
        const percent = Math.round(r * 100);
        $progressBar.style.width = `${percent}%`;
        $progressBar.firstElementChild!.textContent = `${
          percent > 1 ? percent - 1 : percent
        } %`;
      },
      map((r) => ({ action: "PROGRESS", payload: r }))
    )
  );

  uploadStream$ = this.file$.pipe(
    switchMap(this.readFileInfo),
    switchMap((i) =>
      ajax.post(`${apiHost}/upload/chunk`, i.fileinfo).pipe(
        map((r: any) => {
          const blobs = this.slice(
            i.file,
            r.response.chunks,
            r.response.chunkSize
          );
          return { blobs, chunkMeta: r.response, file: i.file };
        })
      )
    ),
    tap(() => {
      this.buildPauseIcon();
    }),
    switchMap(({ blobs, chunkMeta, file }) => {
      const uploaded: number[] = [];
      const dists = blobs.map((blob, index) => {
        let currentLoaded = 0;
        return this.uploadChunk(chunkMeta, index, blob).pipe(
          tap((r) => {
            currentLoaded = r.loaded / file.size;
            uploaded[index] = currentLoaded;
            const percent = uploaded.reduce(
              (acc, val) => acc + (val ? val : 0)
            );
            this.action$.next({ name: "progress", payload: percent });
          })
        );
      });

      const uploadStream = from(dists).pipe(mergeAll(this.concurrency));

      return forkJoin(uploadStream, mapTo(chunkMeta));
    }),
    switchMap((r: ChunkMeta) =>
      ajax.post(`${apiHost}/upload/chunk/${r.fileKey}`).pipe(
        mapTo({
          action: "UPLOAD_SUCCESS",
          playload: r,
        })
      )
    ),
    do(() => {
       $progressBar.firstElementChild.textContent = '100 %'
      // restore icon
      $attachment.classList.remove('glyphicon-pause')
      $attachment.classList.add('glyphicon-paperclip');
      ($attachment.firstElementChild as HTMLInputElement).disabled = false
}),
    merge(this.progress$, this.click$)
  );

  constructor(private concurrency = 3) {}

  private buildPauseIcon() {
    $attachment.classList.remove("glyphicon-paperclip");
    $attachment.classList.add("glyphicon-pause");
    ($attachment.firstElementChild as HTMLInputElement).disabled = true;
  }

  private slice(file: File, n: number, chunkSize: number): Blob[] {
    const result: Blob[] = [];
    for (let i = 0; i < n; i++) {
      const startSize = i * chunkSize;
      const slice = file.slice(
        startSize,
        i === n - 1 ? startSize + (file.size - startSize) : (i + 1) * chunkSize
      );
      result.push(slice);
    }
    return result;
  }

  private readFileInfo(
    file: File
  ): Observable<{ file: File; fileinfo: FileInfo }> {
    const reader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    reader.readAsArrayBuffer(file);

    return new Observable(
      (observer: Subscriber<{ file: File; fileinfo: FileInfo }>) => {
        reader.onload = (e) => {
          spark.append(e.target!.result! as ArrayBuffer);
          const fileMD5 = spark.end();
          observer.next({
            file,
            fileinfo: {
              fileMD5,
              fileSize: file.size,
              lastUpdated: file.lastModified.toString(),
              fileName: file.name,
            },
          });
          observer.complete();
        };
        return () => {
          if (!reader.result) {
            console.warn("read file aborted");
            reader.abort();
          }
        };
      }
    );
  }

  private uploadChunk(
    meta: ChunkMeta,
    index: number,
    blob: Blob
  ): Observable<ProgressEvent> {
    const host = `${apiHost}/upload/chunk/${meta.fileKey}?chunk=${
      index + 1
    }&chunk=${meta.chunks}`;
    return new Observable((subscriber) => {
      const ajax$ = ajax({
        url: host,
        body: blob,
        method: "post",
        crossDomain: true,
        headers: {
          "Content-Type": "application/octet-stream",
        },
        progressSubscriber: subscriber,
      }).pipe(
        takeUntil(this.pause$),
        repeatWhen(() => this.resume$)
      );

      const subscription = ajax$.subscribe();
      return () => subscription.unsubscribe();
    });
  }
}
