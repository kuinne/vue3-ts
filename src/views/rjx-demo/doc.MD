- `concatAll() `
  运算符订阅来自“外部”Observable 的每个“内部”Observable，并复制所有发出的值，直到该 Observable 完成，然后继续处理下一个。

- `mergeAll()`
  在每个内部 Observable 到达时订阅它，然后在每个值到达时发出它

- `switchAll()`
  当第一个内部 Observable 到达时订阅它，并在它到达时发出每个值，但当下一个内部 Observable 到达时，取消订阅前一个，并订阅新的。

- `exhaustAll()`
  当第一个内部 Observable 到达时订阅它，并在到达时发出每个值，丢弃所有新到达的内部 Observable，直到第一个内部 Observable 完成，然后等待下一个内部 Observable。
