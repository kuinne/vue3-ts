import { defineComponent, onMounted, ref, watch } from "vue";
import Stage from "./Stage";
import Sprite from "./Sprite";
import { RectSpriteMeta } from "./RectSprite";
import { LineSpriteMeta } from "./LineSprite";
import type { ISprite } from "./type";
import { GraphicEditorCore } from "./GraphicEditor";

const defaultSpriteList: ISprite[] = [
  {
    id: "RectSprite1",
    type: "RectSprite",
    props: {
      fill: "#fdc5bf",
    },
    attrs: {
      coordinate: { x: 100, y: 100 },
      size: { width: 160, height: 100 },
      angle: 0,
    },
  },
  {
    id: "LineSpriteMeta1",
    type: "LineSprite",
    props: {
      stroke: "#84db92",
      strokeWidth: 3,
      x1: 0,
      y1: 0,
      x2: 160,
      y2: 100,
    },
    attrs: {
      coordinate: { x: 100, y: 240 },
      size: { width: 160, height: 100 },
      angle: 0,
    },
  },
];

export default defineComponent({
  setup() {
    const editorRef = ref<InstanceType<typeof GraphicEditorCore>>();

    watch(editorRef, () => {
      if (!editorRef.value) return;

      (editorRef.value as any).registerSprite(RectSpriteMeta);
      (editorRef.value as any).registerSprite(LineSpriteMeta);
      (editorRef.value as any).addSpriteToStage(defaultSpriteList);
    });
    return () => <GraphicEditorCore ref={editorRef} width={800} height={500} />;
  },
});
