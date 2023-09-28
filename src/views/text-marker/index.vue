<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import Mark from "mark.js";
import { nanoid } from "nanoid";

type TTag = {
  tag_name: string;
  tag_id: string;
  tag_color: string;
};

type TSelectText = {
  tag_id: string;
  tag_name: string;
  tag_color: string;
  start: number;
  end: number;
  mark_content: string;
  mark_id: string;
};

const TAG_WIDTH = 280;

const selectedTextList = ref<TSelectText[]>([]);

const selectedText = reactive({
  start: 0,
  end: 0,
  content: "",
});

const markContent = ref(
  "这是标注的内容有业绩还是我我很快就很快就开完如突然好几个地方各级很大功夫数据库二极管捍卫国家和我回家很晚十九世纪俄国激活工具和丈母娘环境和颠覆国家的高房价奥苏爱哦因为i以太网图的还是觉得好看啊空间函数调用加快速度还是饥渴的发货可是磕碰日俄和那那么会就开始开会的数据库和也会觉得讲故事的而黄金九二额呵呵三角函数的吧合乎实际的和尽快核实当升科技看交互的接口和送二ui为人开朗少女都被你们进货金额麦当娜表面上的"
);

const tagInfo = ref({
  visible: false,
  top: 0,
  left: 0,
});

const editTag = ref({
  visible: false,
  top: 0,
  left: 0,
  mark_id: "",
  content: "",
  tag_id: "",
  start: 0,
  end: 0,
});

const tagList: TTag[] = [
  {
    tag_name: "标签一",
    tag_color: `#DE050CFF`,
    tag_id: "tag_id1",
  },
  {
    tag_name: "标签二",
    tag_color: `#6ADE05FF`,
    tag_id: "tag_id2",
  },
  {
    tag_name: "标签三",
    tag_color: `#DE058BFF`,
    tag_id: "tag_id3",
  },
  {
    tag_name: "标签四",
    tag_color: `#9205DEFF`,
    tag_id: "tag_id4",
  },
  {
    tag_name: "标签五",
    tag_color: `#DE5F05FF`,
    tag_id: "tag_id5",
  },
];

const handleAllDelete = () => {
  selectedTextList.value = [];
  const marker = new Mark(document.getElementById("text-container"));
  marker.unmark();
};

const handleCancel = () => {
  if (!editTag.value.mark_id) return;
  const markEl = new Mark(document.getElementById(editTag.value.mark_id));
  markEl.unmark();
  selectedTextList.value.splice(
    selectedTextList.value?.findIndex(
      (t) => t.mark_id == editTag.value.mark_id
    ),
    1
  );
  tagInfo.value = {
    visible: false,
    top: 0,
    left: 0,
  };
  resetEditTag();
};

const handleReset = () => {
  editTag.value.visible = false;
  tagInfo.value.visible = true;
};

const handleSave = () => {
  console.log("标注的数据", selectedTextList.value);
};

const handleSelectLabel = (t: TTag) => {
  const { tag_color, tag_name, tag_id } = t;
  tagInfo.value.visible = false;
  const marker = new Mark(document.getElementById("text-container"));
  const markId = nanoid(10);
  const isReset = selectedTextList.value
    ?.map((j) => j.mark_id)
    .includes(editTag.value.mark_id)
    ? 1
    : 0; // 1:重选 0:新增
  console.log("isReset", isReset);

  if (isReset) {
    //如若重选,则删除后再新增标签
    const markEl = new Mark(document.getElementById(editTag.value.mark_id));
    markEl.unmark();
    selectedTextList.value.splice(
      selectedTextList.value?.findIndex(
        (t) => t.mark_id == editTag.value.mark_id
      ),
      1
    );
  }
  marker.markRanges(
    [
      {
        start: isReset ? editTag.value.start : selectedText.start,
        length: isReset
          ? editTag.value.content.length
          : selectedText.content.length,
      },
    ],
    {
      className: "text-selected",
      element: "span",
      each: (element: any) => {
        console.log("element", element);

        element.setAttribute("id", markId);
        element.style.borderBottom = `2px solid ${t.tag_color}`;
        element.style.color = t.tag_color;
        element.style.userSelect = "none";
        element.style.paddingBottom = "6px";
        element.onclick = function (e: any) {
          e.preventDefault();
          if (!e.target.id) return;
          const left = e.offsetX < TAG_WIDTH ? 0 : e.offsetX - 300;
          const item = selectedTextList.value?.find?.(
            (t) => t.mark_id == e.target.id
          ) as any;
          const { mark_content, tag_id, start, end } = item || {};
          editTag.value = {
            visible: true,
            top: e.offsetY + 40,
            left: e.offsetX,
            mark_id: e.target.id,
            content: mark_content || "",
            tag_id: tag_id || "",
            start: start,
            end: end,
          };
          tagInfo.value = {
            visible: false,
            top: e.offsetY + 40,
            left: left,
          };
        };
      },
    }
  );
  selectedTextList.value.push({
    tag_color,
    tag_name,
    tag_id,
    start: isReset ? editTag.value.start : selectedText.start,
    end: isReset ? editTag.value.end : selectedText.end,
    mark_content: isReset ? editTag.value.content : selectedText.content,
    mark_id: markId,
  });
};

/**
 * 获取选取的文字数据
 */
const getSelectedTextData = () => {
  const select = window?.getSelection() as any;
  const nodeValue = select.focusNode?.nodeValue;
  console.log("nodeValue", nodeValue);

  const anchorOffset = select.anchorOffset;
  const focusOffset = select.focusOffset;

  const nodeValueSatrtIndex = markContent.value?.indexOf(nodeValue);
  console.log("nodeValueSatrtIndex", nodeValueSatrtIndex);

  selectedText.content = select.toString();
  if (anchorOffset < focusOffset) {
    //从左到右标注
    selectedText.start = nodeValueSatrtIndex + anchorOffset;
    selectedText.end = nodeValueSatrtIndex + focusOffset;
  } else {
    //从右到左
    selectedText.start = nodeValueSatrtIndex + focusOffset;
    selectedText.end = nodeValueSatrtIndex + anchorOffset;
  }
  console.log("selectedText", selectedText);
};

const resetEditTag = () => {
  editTag.value = {
    visible: false,
    top: 0,
    left: 0,
    mark_id: "",
    content: "",
    tag_id: "",
    start: 0,
    end: 0,
  };
};

const drawMark = () => {
  //模拟后端返回的数据
  const res = [
    {
      start: 2, //必备
      end: 6,
      tag_color: "#DE050CFF",
      tag_id: "tag_id1",
      tag_name: "标签一",
      mark_content: "标注的内容",
      mark_id: "mark_id1",
    },
    {
      start: 39,
      end: 41,
      tag_color: "#6ADE05FF",
      tag_id: "tag_id2",
      tag_name: "标签二",
      mark_content: "二极管",
      mark_id: "mark_id2",
    },
    {
      start: 58,
      end: 61,
      tag_color: "#DE058BFF",
      tag_id: "tag_id3",
      tag_name: "标签三",
      mark_content: "激活工具",
      mark_id: "mark_id3",
    },
  ];
  selectedTextList.value = res?.map((t) => ({
    tag_id: t.tag_id,
    tag_name: t.tag_name,
    tag_color: t.tag_color,
    start: t.start,
    end: t.end,
    mark_content: t.mark_content,
    mark_id: t.mark_id,
  }));
  const markList =
    selectedTextList.value?.map((j) => ({
      ...j,
      start: j.start, //必备
      length: j.end - j.start + 1, //必备
    })) || [];
  const marker = new Mark(document.getElementById("text-container"));
  markList?.forEach?.(function (m: any) {
    marker.markRanges([m], {
      element: "span",
      className: "text-selected",
      each: (element: any) => {
        element.setAttribute("id", m.mark_id);
        element.style.borderBottom = `2px solid ${m.tag_color}`;
        element.style.color = m.tag_color;
        element.style.userSelect = "none";
        element.style.paddingBottom = "6px";
        element.onclick = function (e: any) {
          console.log("cccccc", m);
          const left = e.offsetX < TAG_WIDTH ? 0 : e.offsetX - 300;
          editTag.value = {
            visible: true,
            top: e.offsetY + 40,
            left: e.offsetX,
            mark_id: m.mark_id,
            content: m.mark_content,
            tag_id: m.tag_id,
            start: m.start,
            end: m.end,
          };
          tagInfo.value = {
            visible: false,
            top: e.offsetY + 40,
            left: left,
          };
        };
      },
    });
  });
};

//页面初始化
onMounted(() => {
  const el = document.getElementById("text-container");
  //鼠标抬起
  el?.addEventListener("mouseup", (e) => {
    const text = window?.getSelection()?.toString() || "";
    if (text.length > 0) {
      const left = e.offsetX < TAG_WIDTH ? 0 : e.offsetX - 300;
      tagInfo.value = {
        visible: true,
        top: e.offsetY + 40,
        left: left,
      };
      getSelectedTextData();
    } else {
      tagInfo.value.visible = false;
    }
    //清空重选/取消数据
    resetEditTag();
  });
  //从后端获取标注数据，进行初始化标注
  drawMark();
});
</script>

<template>
  <header>
    <n-button
      type="primary"
      :disabled="selectedTextList.length == 0 ? true : false"
      ghost
      @click="handleAllDelete"
    >
      清空标记
    </n-button>
    <n-button
      type="primary"
      :disabled="selectedTextList.length == 0 ? true : false"
      @click="handleSave"
    >
      保存
    </n-button>
  </header>
  <main>
    <div id="text-container" class="text">
      {{ markContent }}
    </div>
    <!-- 标签选择 -->
    <div
      v-if="tagInfo.visible && tagList.length > 0"
      :class="['tag-box p-4 ']"
      :style="{ top: tagInfo.top + 'px', left: tagInfo.left + 'px' }"
    >
      <div
        v-for="i in tagList"
        :key="i.tag_id"
        class="tag-name"
        @click="handleSelectLabel(i)"
      >
        <n-space>
          <p>{{ i.tag_name }}</p>
          <n-button v-if="i.tag_id == editTag.tag_id" text type="primary"
            >√</n-button
          >
        </n-space>
        <div
          :class="['w-4 h-4']"
          :style="{
            background: i.tag_color,
          }"
        ></div>
      </div>
    </div>
    <!-- 重选/取消 -->
    <div
      v-if="editTag.visible"
      class="edit-tag"
      :style="{ top: editTag.top + 'px', left: editTag.left + 'px' }"
    >
      <div class="py-1 bg-gray-100 text-center" @click="handleCancel">
        取 消
      </div>
      <div class="py-1 bg-gray-100 mt-2 text-center" @click="handleReset">
        重 选
      </div>
    </div>
  </main>
</template>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 80px;
  border-bottom: 1px solid #e5e7eb;
  user-select: none;
  background: #fff;
}

main {
  background: #fff;
  margin: 24px;
  height: 80vh;
  padding: 24px;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 3px 8px 0 rgb(0 0 0 / 13%);
  .text {
    color: #333;
    font-weight: 500;
    font-size: 16px;
    line-height: 50px;
  }
  .tag-box {
    position: absolute;
    z-index: 10;
    width: 280px;
    max-height: 40vh;
    overflow-y: auto;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 9px 28px 8px rgb(0 0 0 / 3%), 0 6px 16px 4px rgb(0 0 0 / 9%),
      0 3px 6px -2px rgb(0 0 0 / 20%);
    user-select: none;
    .tag-name {
      width: 100%;
      background: rgba(243, 244, 246, var(--tw-bg-opacity));
      font-size: 14px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      margin-top: 8px;
    }
    .tag-name:nth-of-type(1) {
      margin-top: 0;
    }
  }
  .edit-tag {
    position: absolute;
    z-index: 20;
    padding: 16px;
    cursor: pointer;
    width: 100px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 9px 28px 8px rgb(0 0 0 / 3%), 0 6px 16px 4px rgb(0 0 0 / 9%),
      0 3px 6px -2px rgb(0 0 0 / 20%);
    user-select: none;
  }
  ::selection {
    background: rgb(51 51 51 / 20%);
  }
}
</style>
