import { counter, add, minus } from '../store'
export default function useSubCounter() {
  const render = () => (
    <div>
      <h2>use-sub-counter</h2>
      <h3>{counter.value}</h3>
      <br />
      <button onClick={add}>add</button>
      <button onClick={minus}>minus</button>
    </div>
  )
  return {
    render,
  }
}
