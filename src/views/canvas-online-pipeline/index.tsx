import { defineComponent, ref, watch } from "vue";
import styles from "./style.module.scss";
import "./assets/css/base.css";
import canvasUtil, { ElementFactory } from "./utils/canvas";
import { DrawType, ModifyType, PipelineWaterType } from "./enums";
import { Equipment } from "./type";
import {
  ElButton,
  ElColorPicker,
  ElDialog,
  ElDivider,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
} from "element-plus";
import { cloneDeep } from "lodash";
const getFullUrl = (path: string) => {
  return new URL(path, import.meta.url).href;
};

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement>();

    // 设备列表
    const equipment = ref<Equipment[]>([
      {
        name: "管线",
        eId: 11,
        icon: getFullUrl("./assets/images/line.png"),
        iconPath: "line.png",
        drawType: 0,
      },
      {
        name: "温度表",
        eId: 1,
        icon: getFullUrl("./assets/images/thermometer.png"),
        iconPath: "thermometer.png",
        drawType: 1,
      },
      {
        name: "压力表",
        eId: 2,
        icon: getFullUrl("./assets/images/manometer.png"),
        iconPath: "manometer.png",
        drawType: 1,
      },
      {
        name: "接头",
        eId: 3,
        icon: getFullUrl("./assets/images/joint.png"),
        iconPath: "joint.png",
        drawType: 1,
      },
      {
        name: "直流阀",
        eId: 4,
        icon: getFullUrl("./assets/images/direct_current_valve.png"),
        iconPath: "direct_current_valve.png",
        drawType: 1,
      },
      {
        name: "循环阀",
        eId: 5,
        icon: getFullUrl("./assets/images/circulating_valve.png"),
        iconPath: "circulating_valve.png",
        drawType: 1,
      },
      {
        name: "电动阀",
        eId: 6,
        icon: getFullUrl("./assets/images/electric_valve.png"),
        iconPath: "electric_valve.png",
        drawType: 1,
      },
      {
        name: "开关阀",
        eId: 7,
        icon: getFullUrl("./assets/images/on_off_valve.png"),
        iconPath: "on_off_valve.png",
        drawType: 1,
      },
      {
        name: "热换机",
        eId: 8,
        icon: getFullUrl("./assets/images/heat_exchanger.png"),
        iconPath: "heat_exchanger.png",
        drawType: 1,
      },
      {
        name: "热换机",
        eId: 9,
        icon: getFullUrl("./assets/images/heat_exchanger1.png"),
        iconPath: "heat_exchanger1.png",
        drawType: 1,
      },
      {
        name: "蓄水池",
        eId: 10,
        icon: getFullUrl("./assets/images/reservoir.png"),
        iconPath: "reservoir.png",
        drawType: 1,
      },
    ]);

    // 设备选中index
    const equipmentSelect = ref(0);

    // 冷热水下拉列表
    const waterTypeOptions = ref([
      {
        value: PipelineWaterType.Cold,
        label: "冷水",
      },
      {
        value: PipelineWaterType.Hot,
        label: "热水",
      },
    ]);

    // 冷热水选中值
    const waterType = ref<PipelineWaterType>(PipelineWaterType.Cold);

    // 文字添加状态
    const addTextStatus = ref(false);

    // 修改类型
    const modifyType = ref(ModifyType.Equipment);

    // 弹窗显隐
    const iconDialog = ref(false);

    // 设备信息
    const iconForm = ref<Partial<ElementFactory["equipmentInfo"]>>({
      show: true,
      name: "",
      id: "",
      unit: "",
      scale: 1,
      rotate: 0,
      others: [],
    });

    // 文本信息
    const textForm = ref<Partial<ElementFactory["textInfo"]>>({
      text: "",
      fontSize: 14,
      color: "",
    });

    // 旋转角度
    const rotateOptions = ref([
      {
        label: "0 度",
        value: 0,
      },
      {
        label: "90 度",
        value: 90,
      },
      {
        label: "-90 度",
        value: -90,
      },
      {
        label: "180 度",
        value: 180,
      },
    ]);

    // 当前选择颜色
    const color = ref("");
    const colorStatus = ref(false);

    // 存储临时回显数据
    const echoDataList = ref<any[]>([]);

    const equipmentChange = (eq: Equipment, index: number) => {
      equipmentSelect.value = index;
      addTextStatus.value = false;
      canvasUtil.drawTypeChange(eq);
    };
    const pipelineTypeChange = () => {
      canvasUtil.changePipelineType(waterType.value);
    };
    const addText = () => {
      addTextStatus.value = !addTextStatus.value;
      equipmentSelect.value = addTextStatus.value ? -1 : 0;
      canvasUtil.drawTypeChange(
        addTextStatus.value
          ? {
              drawType: DrawType.Text,
              name: "",
              icon: "",
              iconPath: "",
              eId: 0,
            }
          : equipment.value[0]
      );
    };
    const commit = () => {
      canvasUtil.commit();
    };
    const showEquipmentArea = () => {
      canvasUtil.showEquipmentIconArea();
    };
    const clearAll = () => {
      canvasUtil.clearAll();
    };
    const delDescribe = (index: number) => {};
    const addDescribe = () => {};
    const colorValueChange = () => {};
    const iconModify = () => {
      switch (modifyType.value) {
        case ModifyType.Equipment:
          canvasUtil.canvasModifyInfo(iconForm.value, modifyType.value);
          break;

        case ModifyType.Text:
          canvasUtil.canvasModifyInfo(textForm.value, modifyType.value);
          break;
      }
      iconDialog.value = false;
    };

    const handleMouseup = (type: ModifyType) => {
      modifyType.value = type;
      const currentEditObject = cloneDeep(canvasUtil.canvasMouseUp()!);
      currentEditObject.equipmentInfo &&
        (iconForm.value = currentEditObject.equipmentInfo);
      currentEditObject.textInfo &&
        (textForm.value = currentEditObject.textInfo);
      iconDialog.value = true;
    };

    watch(canvas, () => {
      if (!canvas.value) return;

      canvasUtil.init(canvas.value);

      window.addEventListener("click", (e) => {
        console.log("ss", e.target.id);

        if ((e.target?.id || "").includes("equipmentModify")) {
          handleMouseup(ModifyType.Equipment);
        }

        if ((e.target?.id || "").includes("textModify")) {
          handleMouseup(ModifyType.Text);
        }
      });
    });

    const CanvasIconContent = () => (
      <div class={styles["canvas-icon-content"]}>
        <ul>
          {equipment.value.map((eq, index) => (
            <li
              key={index}
              class={{
                [styles["canvas-icon-active"]]: equipmentSelect.value === index,
              }}
              onClick={() => equipmentChange(eq, index)}
            >
              <img src={eq.icon} alt={eq.name}></img>
              <p>{eq.name}</p>
            </li>
          ))}
        </ul>
      </div>
    );

    const CanvasContent = () => (
      <div class={styles["canvas"]}>
        <canvas ref={canvas}></canvas>
      </div>
    );

    const CanvasOptions = () => {
      const WaterType = () => (
        <div class={styles["option-change-water-type"]}>
          <ElSelect v-model={waterType.value} onChange={pipelineTypeChange}>
            {waterTypeOptions.value.map((item) => (
              <ElOption
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </ElSelect>
        </div>
      );

      const DrawText = () => (
        <div class={styles["option-draw-text"]}>
          <ElButton
            type={addTextStatus.value ? "success" : "warning"}
            onClick={addText}
          >
            自定义文字
          </ElButton>
        </div>
      );

      const OptionCommit = () => (
        <div class={styles["option-commit"]}>
          <ElButton type="primary" onClick={commit}>
            上传所绘制的内容
          </ElButton>
        </div>
      );

      const OptionDrag = () => (
        <div class={styles["option-drag"]}>
          <ElButton type="info" plain onClick={showEquipmentArea}>
            显示设备拖动区域
          </ElButton>
        </div>
      );

      const OptionClear = () => (
        <div class={styles["option-clear"]}>
          <ElButton type="info" onClick={clearAll}>
            清除所有绘制内容
          </ElButton>
        </div>
      );

      return (
        <div class={styles["canvas-options"]}>
          <WaterType />
          <ElDivider direction="vertical" />
          <DrawText />
          <ElDivider direction="vertical" />
          <OptionCommit />
          <ElDivider direction="vertical" />
          <OptionDrag />
          <ElDivider direction="vertical" />
          <OptionClear />
        </div>
      );
    };

    const PipeInfoAdd = () => {
      const IconForm = () => (
        <ElForm
          model={iconForm.value}
          labelPosition="right"
          labelWidth="120px"
          inline
        >
          <ElFormItem label="设备名称">
            <ElInput v-model={iconForm.value.name}></ElInput>
          </ElFormItem>
          <ElFormItem label="设备编号">
            <ElInput v-model={iconForm.value.id}></ElInput>
          </ElFormItem>
          <ElFormItem label="设备单位">
            <ElInput v-model={iconForm.value.unit}></ElInput>
          </ElFormItem>
          <ElFormItem label="图标缩放比例">
            <ElInputNumber
              v-model={iconForm.value.scale}
              min={10}
              max={30}
              label="值越大，图标越小:10-30"
            ></ElInputNumber>
          </ElFormItem>
          <ElFormItem label="设备旋转角度">
            <ElSelect
              v-model={iconForm.value.rotate}
              placeholder="请选择设备旋转角度"
            >
              {rotateOptions.value.map((item, index) => (
                <ElOption label={item.label} value={item.value}></ElOption>
              ))}
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="是否展示信">
            <ElRadioGroup v-model={iconForm.value.show} size="small">
              <ElRadioButton label={true}>展示</ElRadioButton>
              <ElRadioButton label={false}>隐藏</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem label="描述信息">
            {iconForm.value.others.map((item, index) => (
              <div>
                <ElInput
                  class={styles["describe"]}
                  v-model={iconForm.value.others[index]}
                >
                  {{
                    ["append"]: () => (
                      <ElButton
                        icon="el-icon-delete"
                        onClick={() => delDescribe(index)}
                      ></ElButton>
                    ),
                  }}
                </ElInput>
              </div>
            ))}
            <ElButton size="small" type="primary" onClick={addDescribe}>
              新增描述
            </ElButton>
          </ElFormItem>
        </ElForm>
      );

      const TextForm = () => (
        <ElForm
          model={textForm.value}
          labelPosition="right"
          labelWidth="100px"
          inline
        >
          <ElFormItem label="文本内容">
            <ElInput v-model={textForm.value.text}></ElInput>
          </ElFormItem>
          <ElFormItem label="字体大小">
            <ElInput v-model={textForm.value.fontSize}></ElInput>
          </ElFormItem>
          <ElFormItem label="字体颜色">
            <ElInput
              disabled
              placeholder="请旋转颜色"
              modelValue={textForm.value.color}
              onClick={(colorStatus.value = !colorStatus.value)}
            ></ElInput>
            <div class={styles["sketch-picker"]} v-show={colorStatus.value}>
              <ElColorPicker
                v-model={color.value}
                onChange={colorValueChange}
              ></ElColorPicker>
              <ElButton
                size="small"
                onClick={() => (colorStatus.value = false)}
              >
                取消
              </ElButton>
              <ElButton
                size="small"
                type="primary"
                onClick={() => {
                  colorStatus.value = true;
                }}
              >
                确定
              </ElButton>
            </div>
          </ElFormItem>
        </ElForm>
      );

      return (
        <div class={styles["pipeline-info-add"]}>
          <ElDialog
            title={
              modifyType.value === ModifyType.Equipment
                ? "设备信息"
                : "文本信息"
            }
            v-model={iconDialog.value}
            width="750px"
          >
            <div class={styles["icon-form-container"]}>
              {modifyType.value === ModifyType.Equipment ? (
                <IconForm />
              ) : (
                <TextForm />
              )}
              <div style="width: 100%; display: flex; justify-content: space-around;">
                <ElButton onClick={() => (iconDialog.value = false)}>
                  取消
                </ElButton>
                <ElButton type="primary" onClick={iconModify}>
                  确定
                </ElButton>
              </div>
            </div>
          </ElDialog>
        </div>
      );
    };

    return () => (
      <div class={styles["canvas-container"]}>
        <CanvasIconContent />
        <div class={styles["canvas-content"]}>
          <CanvasContent />
          <CanvasOptions />
        </div>

        <PipeInfoAdd />
      </div>
    );
  },
});
