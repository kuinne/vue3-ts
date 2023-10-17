import { computed, defineComponent, onMounted, ref, unref, watch } from 'vue'
import { createPageContext, usePageContext } from './hooks/use-page-context'

const Child = defineComponent({
  setup() {
    const { contentHeight, setPageHeight } = usePageContext()
    return () => (
      <div>
        <div>child: {contentHeight.value}</div>
        <input onInput={(e) => setPageHeight(e.target.value)}></input>
        <button
          onClick={() => {
            contentHeight.value = Date.now()
          }}
        ></button>
      </div>
    )
  },
})

export default defineComponent({
  setup() {
    const contentHeight = ref(window.innerHeight)
    const pageHeight = ref(window.innerHeight)
    const getViewHeight = computed(() => {
      return unref(contentHeight)
    })

    const wrapRef = ref<HTMLDivElement | null>(null)

    watch(wrapRef, () => {
      if (wrapRef.value) {
        contentHeight.value = wrapRef.value?.clientHeight
      }
    })

    async function setPageHeight(height: number) {
      console.log('setPageHeight', height)

      contentHeight.value = height
    }

    createPageContext({
      contentHeight: getViewHeight,
      pageHeight,
      setPageHeight,
    })
    return () => (
      <div ref={wrapRef}>
        <Child />
      </div>
    )
  },
})
