import { defineComponent } from 'vue'
import { Tree, TreeModel, TreeNode, WalkStrategies } from './utils/tree'

export default defineComponent({
  setup() {
    const model = {
      key: 0,
      value: '0',
      children: [
        {
          key: 1,
          value: '1',
          children: [
            {
              key: 11,
              value: '11',
              children: [
                {
                  key: 111,
                  value: '111',
                },
              ],
            },
          ],
        },
        {
          key: 2,
          value: '2',
        },
      ],
    }

    const treeModel = new TreeModel({})

    const root = treeModel.parse(model)

    const tree = new Tree(root)

    console.log('tree', tree)

    const leafNode = tree.find(111)
    console.log('leafNode', leafNode)

    if (leafNode) {
      WalkStrategies.bottomToUp((node) => {
        console.log('bottomToUp', node)
        if (node.key === 11) return false
        return true
      }, leafNode)
    }

    console.log('depth', tree.depth)

    return () => <div>hello</div>
  },
})
