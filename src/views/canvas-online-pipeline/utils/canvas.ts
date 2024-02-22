import { ModifyType } from "./../enums";
import { Equipment } from "./../type.d";
import { ICON_SCALE_RATIO, PIPELINE_NUMBER } from "../constants";
import { DrawType, PipelineWaterType } from "../enums";

const getImg = (path: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = new URL(path, import.meta.url).href;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject();
    };
  });
};

// const image = new Image();

let canvas!: HTMLCanvasElement;

let ctx!: CanvasRenderingContext2D;

// 所有绘制元素
let allElementCollection: ElementFactory[] = [];

// 初始化管线水类型： 0为冷水 1为热水

let pipeline_water_type = PipelineWaterType.Cold;

// 当前绘制设备的对象
let equipment_select: Equipment;

// 是否显示绘制设备的范围
let equipment_area_show = true;

// 初始化绘制类型
let draw_element_type = DrawType.Shape;

// 管线流动速度初始值
let pipeline_offset = 0;

// 定义当前选中的已绘制元素
let current_select_element_index = -1;

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawImg = (
  img: HTMLImageElement,
  x: number,
  y: number,
  scale: number,
  rotate: number
) => {
  ctx.save();
  // 平移转换，改变画笔的原点位置为画布的中心点
  const originX = x + img.width / scale / 2;
  const originY = y + img.height / scale / 2;
  ctx.translate(originX, originY);

  // 旋转转换，改变画笔旋转角度
  ctx.rotate((rotate * Math.PI) / 180);

  ctx.translate(-originX, -originY);

  ctx.drawImage(img, x, y, img.width / scale, img.height / scale);

  // 使用 restore进行恢复
  ctx.restore();
};
/**
 * 创建绘制元素工厂函数
 */

export class ElementFactory {
  uid!: number;
  startX!: number;
  startY!: number;
  endX!: number;
  endY!: number;

  type!: DrawType;

  pipelineInfo?: {
    direction: boolean;
    waterType: PipelineWaterType;
  };
  equipmentInfo?: {
    id: string;
    iconPath: string; //设备图标地址
    iconImg?: HTMLImageElement;
    name: string; // 设备名称
    unit: string;
    scale: number; //设备图标缩放比例
    rotate: number;
    show: boolean; //设备是否展示图标上方的信息文字
    value: string;
    others: string[]; //设备图标的其他信息
    rotateCoordinate: {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }; //设备图标旋转后的四个坐标位置对象
  };
  textInfo?: {
    text: string;
    fontSize: number;
    color: string;
  };

  constructor(startX: number, startY: number, endX?: number, endY?: number) {
    this.startX = startX; // 鼠标按下 x点
    this.startY = startY; // 鼠标按下 y 点
    // this.endX = endX;
    // this.endY = endY;

    this.type = draw_element_type; // 绘制类型： 图形、文字、图片

    this.pipelineInfo = {
      direction: false,
      waterType: pipeline_water_type,
    }; //图形（管线）私有信息
    this.equipmentInfo = {
      id: "",
      iconPath: equipment_select?.iconPath || "",
      name: equipment_select?.name || "",
      unit: "m/s",
      scale: ICON_SCALE_RATIO,
      rotate: 0,
      show: true,
      value: "12378",
      others: [],
      rotateCoordinate: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
      },
    }; // 图片（设备）（私有信息
    this.textInfo = {
      text: "",
      fontSize: 14,
      color: "#00",
    }; // 文字（文字）私有信息
  }

  get minX() {
    return Math.min(this.startX, this.endX);
  }

  get maxX() {
    return Math.max(this.startX, this.endX);
  }

  get minY() {
    return Math.min(this.startY, this.endY);
  }

  get maxY() {
    return Math.max(this.startY, this.endY);
  }

  get middleX() {
    return this.endX - (this.endX - this.startX) / 2;
  }

  get middleY() {
    return this.endY - (this.endY - this.startY) / 2;
  }

  get coordinate() {
    if (!this.equipmentInfo) {
      return {
        startX: this.startX,
        startY: this.startY,
        endX: this.endX,
        endY: this.endY,
      };
    }
    const image = this.equipmentInfo.iconImg!;
    const ImgWidth = image.width / this.equipmentInfo.scale,
      ImgHeight = image.height / this.equipmentInfo.scale;
    if (Math.abs(this.equipmentInfo.rotate) === 90) {
      return {
        startX: Math.round(this.startX - (ImgHeight - ImgWidth) / 2),
        startY: Math.round(this.startY - (ImgWidth - ImgHeight) / 2),
        endX: Math.round(this.startX - (ImgHeight - ImgWidth) / 2) + ImgHeight,
        endY: Math.round(this.startY - (ImgWidth - ImgHeight) / 2) + ImgWidth,
      };
    } else {
      return {
        startX: this.startX,
        startY: this.startY,
        endX: this.endX,
        endY: this.endY,
      };
    }
  }

  // 判断点击的是否存在元素绘制的范围之内
  isInside(x: number, y: number) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  // 绘制管线
  drawPipeline() {
    if (!this.pipelineInfo) return;
    ctx.beginPath();

    ctx.moveTo(this.minX, this.minY);
    ctx.lineTo(this.maxX, this.minY);
    ctx.lineTo(this.maxX, this.maxY);
    ctx.lineTo(this.minX, this.maxY);
    ctx.lineTo(this.minX, this.minY);
    ctx.fillStyle = ["#19c2ff", "#ffa600"][this.pipelineInfo.waterType];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineCap = "square";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 绘制流动效果
    ctx.beginPath();
    if (this.pipelineInfo.direction) {
      ctx.moveTo(this.minX, this.middleY);
      ctx.lineTo(this.maxX, this.middleY);
      ctx.lineDashOffset =
        this.startX < this.endY ? -pipeline_offset : pipeline_offset;
    } else {
      ctx.moveTo(this.middleX, this.minY);
      ctx.lineTo(this.middleX, this.maxY);
      ctx.lineDashOffset =
        this.startY < this.endY ? -pipeline_offset : pipeline_offset;
    }
    ctx.strokeStyle = ["#18719f", "#ff4316"][this.pipelineInfo.waterType];
    ctx.lineWidth = 5;
    ctx.setLineDash([15, 15]);
    ctx.stroke();
  }

  // 绘制设备
  drawEquipment() {
    if (!this.equipmentInfo) return;

    this.equipmentInfo.rotateCoordinate = this.coordinate;
    const { iconImg, scale, rotate, show } = this.equipmentInfo;
    drawImg(iconImg!, this.startX, this.startY, scale, rotate);

    const imgW = iconImg!.width / scale;
    const imgH = iconImg!.height / scale;

    if (equipment_area_show) {
      ctx.beginPath();
      ctx.moveTo(this.minX, this.minY);
      ctx.lineTo(this.maxX, this.minY);
      ctx.lineTo(this.maxX, this.maxY);
      ctx.lineTo(this.minX, this.maxY);
      ctx.lineTo(this.minX, this.minY);
      ctx.fillStyle = "rgba(0,0,0,0.41)";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineCap = "square";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.closePath();
    }
    // 添加文字描述
    if (show) this.drawEquipmentText();
  }

  // 绘制设备上方文字
  drawEquipmentText() {
    if (!this.equipmentInfo) return;
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.font = "normal normal normal 12px Microsoft YaHei";
    const measureText = ctx.measureText(
      `${this.equipmentInfo.name}: ${this.equipmentInfo.value} ${this.equipmentInfo.unit}`
    );
    let fontWidth = measureText.width,
      fontHeight =
        measureText.actualBoundingBoxAscent +
        measureText.actualBoundingBoxDescent +
        2;
    let fontX =
      this.equipmentInfo.rotateCoordinate.startX +
      (this.equipmentInfo.rotateCoordinate.endX -
        this.equipmentInfo.rotateCoordinate.startX -
        fontWidth) /
        2;
    ctx.fillText(
      `${this.equipmentInfo.name}: ${this.equipmentInfo.value} ${this.equipmentInfo.unit}`,
      fontX,
      this.equipmentInfo.rotateCoordinate.startY - 5
    );

    if (this.equipmentInfo.others.filter((item) => item).length) {
      this.equipmentInfo.others
        .filter((item) => item)
        .map((item, index) => {
          ctx.fillText(
            `${item}`,
            fontX,
            this.equipmentInfo.rotateCoordinate.startY -
              5 -
              fontHeight * (index + 1)
          );
        });
    }
    ctx.closePath();
  }

  // 绘制纯文本
  drawText() {
    if (!this.textInfo) return;
    ctx.beginPath();
    ctx.fillStyle = this.textInfo.color || "#000";
    ctx.font = `normal normal normal ${
      this.textInfo.fontSize + "px" || "16px"
    } Microsoft YaHei`;
    ctx.textBaseline = "top";
    let content = this.textInfo.text;
    ctx.fillText(`${content}`, this.startX, this.startY);
    ctx.closePath();
  }

  // 根据条件来调用不同的绘制方法
  drawAllElement() {
    switch (this.type) {
      case DrawType.Shape:
        this.drawPipeline();
        break;
      case DrawType.Image:
        this.drawEquipment();
        break;
      case DrawType.Text:
        this.drawText();
        break;
    }
  }
}

const draw = async () => {
  for (let pp of allElementCollection) {
    pp.drawAllElement();
  }
};

const canvasMouseDown = async (e: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // 查询所点击元素是否存在
  const shape = getElement(clickX, clickY);

  if (shape) {
    moveAllElement(e, clickX, clickY, rect, shape);
    canvas.style.cursor = "move";
  } else {
    if (e.buttons === 1) {
      switch (draw_element_type) {
        case DrawType.Shape:
          drawRealTimePipeline(e, clickX, clickY, rect);
          break;
        case DrawType.Image:
          await drawRealTimeEquipment(e, clickX, clickY, rect);
          break;
        case DrawType.Text:
          drawRealTimeText(e, clickX, clickY, rect);
          break;
        default:
          break;
      }
    }
  }
};

// 鼠标点击canvas查看是否点击到了已经绘制的路线，若是，则返回相关线的对象，若否，返回null

const getElement = (x: number, y: number) => {
  for (let i = allElementCollection.length - 1; i >= 0; i--) {
    const element = allElementCollection[i];

    if (element.isInside(x, y)) {
      current_select_element_index = i;

      return element;
    }
  }
  return null;
};

// 绘制实时管线
const drawRealTimePipeline = (
  e: MouseEvent,
  clickX: number,
  clickY: number,
  rect: DOMRect
) => {
  const shape = new ElementFactory(clickX, clickY);
  shape.endX = clickX;
  shape.endY = clickY;

  // 绘制管线时， 删除通过 new 对象的 textInfo 和 equipmentInfo，这两个对于管线来说没有用处
  delete shape.textInfo;
  delete shape.equipmentInfo;

  let shapeWidth = 0,
    shapeHeight = 0;

  let current_uid = setuid(shape);

  allElementCollection.push(shape);

  window.onmousemove = (evt) => {
    clearCanvas();
    shapeWidth = evt.clientX - rect.left - clickX;
    shapeHeight = evt.clientY - rect.top - clickY;

    // 判断绘制为竖线还是横线
    let shapeDirection = Math.abs(shapeWidth) >= Math.abs(shapeHeight);

    if (shapeDirection) {
      // 如果是横线，则 endY 为固定值
      shape.endX = evt.clientX - rect.left;
      shape.endY = clickY + PIPELINE_NUMBER;
    } else {
      shape.endX = clickX + PIPELINE_NUMBER;
      shape.endY = evt.clientY - rect.top;
    }

    shape.pipelineInfo && (shape.pipelineInfo.direction = shapeDirection);
    shape.pipelineInfo && (shape.pipelineInfo.waterType = pipeline_water_type);
    draw();
  };

  // 画线时，鼠标抬起判断如果线段绘制过短，则不推入 allElementCollection
  window.onmouseup = () => {
    if (draw_element_type === DrawType.Shape && shape.endX) {
      if (
        Math.abs(shape.startX - shape.endX) < 45 &&
        Math.abs(shape.startY - shape.endY) < 45
      ) {
        let index = allElementCollection.findIndex(
          (item) => item.uid === current_uid
        );
        allElementCollection.splice(index, 1);
        clearCanvas();
        draw();
      }
    }
  };
};

// 绘制实时设备

const drawRealTimeEquipment = async (
  e: MouseEvent,
  clickX: number,
  clickY: number,
  rect: DOMRect
) => {
  const shape = new ElementFactory(clickX, clickY);

  delete shape.textInfo;
  delete shape.pipelineInfo;

  // 设备绘制在鼠标点击的那一刻就需要开始创建，

  const image = await getImg(`../assets/images/${equipment_select.iconPath}`);
  shape.equipmentInfo!.iconImg = image;
  setEquipment(e);
  setuid(shape);

  allElementCollection.push(shape);

  window.onmousemove = (evt) => setEquipment(evt);

  function setEquipment(evt: MouseEvent) {
    clearCanvas();
    shape.startX = evt.clientX - rect.left;
    shape.startY = evt.clientY - rect.top;

    let icon_width = Math.ceil(image.width / ICON_SCALE_RATIO),
      icon_height = Math.ceil(image.height / ICON_SCALE_RATIO);

    shape.endX = shape.startX + icon_width;

    shape.endY = shape.startY + icon_height;

    draw();
  }

  draw();
};

// 元素移动
const moveAllElement = (
  e: MouseEvent,
  clickX: number,
  clickY: number,
  rect: DOMRect,
  shape: ElementFactory
) => {
  const { startX, startY, endX, endY } = shape;

  let tipX = 0,
    tipY = 0;

  // 鼠标左键：拖动位置
  if (e.buttons === 1) {
    window.onmousemove = (evt) => {
      removeEditTip();
      clearCanvas();
      const distanceX = evt.clientX - rect.left - clickX;
      const distanceY = evt.clientY - rect.top - clickY;
      shape.startX = startX + distanceX;
      shape.startY = startY + distanceY;

      shape.endX = endX + distanceX;
      shape.endY = endY + distanceY;

      draw();
    };
  }

  // 鼠标右键： 执行信息编辑
  if (e.buttons === 2) {
    switch (shape.type) {
      case DrawType.Shape:
        // 管线
        tipX = e.clientX;
        tipY = e.clientY + 10;

        break;
      case DrawType.Image:
        // 如果点击的是图标，弹出提示出现在图标下方
        tipX = (shape.endX - shape.startX) / 2 + shape.startX + rect.left;
        tipY = shape.endY + rect.top;
        break;
      case DrawType.Text:
        // 文字
        tipX =
          shape.startX +
          rect.left +
          ctx.measureText(`${shape.textInfo?.text}`).width / 2;
        tipY = shape.startY + rect.top;
        break;
    }

    createEditTip(tipX, tipY, shape);
    return false;
  }
};
// 绘制实时文字
const drawRealTimeText = (
  e: MouseEvent,
  clickX: number,
  clickY: number,
  rect: DOMRect
) => {
  const shape = new ElementFactory(clickX, clickY);
  setuid(shape);

  delete shape.equipmentInfo;
  delete shape.pipelineInfo;

  ctx.font = `normal normal normal ${
    shape.textInfo?.fontSize + "px" || "16px"
  } Microsoft YaHei`;

  const defaultText = "默认文字，清右键修改";
  const measureText = ctx.measureText(defaultText);
  const textW = measureText.width,
    textH =
      measureText.actualBoundingBoxAscent +
      measureText.actualBoundingBoxDescent;
  shape.textInfo && (shape.textInfo.text = defaultText);
  allElementCollection.push(shape);

  setText(e);
  window.onmousemove = (evt) => setText(evt);

  function setText(evt: MouseEvent) {
    clearCanvas();
    shape.startX = evt.clientX - rect.left;
    shape.startY = evt.clientY - rect.top;
    shape.endX = shape.startX + textW;
    shape.endY = shape.startY + textH;

    draw();
  }

  draw();
};

// 创建管线事件弹窗
const createEditTip = (x: number, y: number, shape: ElementFactory) => {
  let width = shape.type ? 180 : 120,
    marginLeft = shape.type ? 95 : 65,
    display = shape.type ? "inline-block" : "none";
  removeEditTip();
  let tipText = document.createElement("div");
  tipText.classList.add("tip-text-content");
  tipText.innerHTML = `<div class="tip-text" id="tipText" style="top: ${
    y + 10
  }px;left: ${x}px; width: ${width}px; margin-left:-${marginLeft}px; ">
                            <p>
                                <span id="equipmentDelete">删除</span>
                                <span id="${
                                  shape.type === DrawType.Text
                                    ? "textModify"
                                    : "equipmentModify"
                                }" style="display: ${display}">编辑</span>
                                <span id="buttonCancel">取消</span>
                            </p>
                         </div>`;
  document.body.appendChild(tipText);

  document.getElementById("equipmentDelete")!.onclick = () => {
    allElementCollection.splice(current_select_element_index, 1);
    clearCanvas();
    draw();
    removeEditTip();
  };

  // 判断点击的是 图片 的编辑按钮，还是 文字 的编辑按钮
  let modifyButton = document.getElementById("equipmentModify")
    ? "equipmentModify"
    : "textModify";

  document.getElementById(modifyButton)!.onclick = () => {
    removeEditTip();
  };

  document.getElementById("buttonCancel")!.onclick = () => {
    removeEditTip();
  };
};

// 移除管线事件弹窗
const removeEditTip = () => {
  const popup = document.querySelector(".tip-text-content");
  if (popup) document.body.removeChild(popup);
};

const setuid = (shape: ElementFactory) => {
  // 生成唯一ID
  let uid = Math.round(Math.random() * 100000000000);
  shape.uid = uid;
  return uid;
};

const calculationFlow = () => {
  requestAnimationFrame(calculationFlow);
  pipeline_offset++;
  if (pipeline_offset > 300) {
    pipeline_offset = 0;
  }
  for (const pp of allElementCollection) {
    if (pp.type === DrawType.Shape) {
      pp.drawPipeline();
    }
  }
};

const canvasDraw = {
  init(_canvas: HTMLCanvasElement) {
    canvas = _canvas;
    ctx = canvas.getContext("2d")!;
    const w = 1200,
      h = 800;
    canvas.width = w;
    canvas.height = h;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    calculationFlow();

    canvas.onmousedown = (e) => canvasMouseDown(e);

    canvas.onmouseup = () => {
      canvas.onmousemove = null;
      window.onmousemove = null;
      canvas.style.cursor = "crosshair";
    };
    return canvas;
  },

  // 回传鼠标抬起事件
  canvasMouseUp: () => {
    return allElementCollection[current_select_element_index];
  },

  // 绘制类型切换
  drawTypeChange: (eq: Equipment) => {
    equipment_select = eq;
    draw_element_type = eq.drawType;
  },

  // 修改管线类型（冷热水）
  changePipelineType: (type: PipelineWaterType) => {
    pipeline_water_type = type;
  },

  // 设置参数修改
  canvasModifyInfo: (info: any, modifyType: ModifyType) => {
    const shape = allElementCollection[current_select_element_index];
    if (!shape) return;
    switch (modifyType) {
      case ModifyType.Equipment:
        let icon_width = Math.ceil(
            shape.equipmentInfo!.iconImg!.width / info.scale
          ),
          icon_height = Math.ceil(
            shape.equipmentInfo!.iconImg!.height / info.scale
          );
        shape.endX = shape.startX + icon_width;
        shape.endY = shape.startY + icon_height;
        allElementCollection[current_select_element_index].equipmentInfo = info;
        break;

      case ModifyType.Text:
        ctx.font = `normal normal normal ${
          info.fontSize + "px" || "16px"
        } Microsoft YaHei`;
        const measureText = ctx.measureText(info.text);
        const textW = measureText.width,
          textH =
            measureText.actualBoundingBoxAscent +
            measureText.actualBoundingBoxDescent;
        shape.endX = shape.startX + textW;
        shape.endY = shape.startY - textH;
        allElementCollection[current_select_element_index].textInfo = info;
        break;
    }
    clearCanvas();
    draw();
  },

  // 显示设备可拖动的区域范围
  showEquipmentIconArea: () => {
    equipment_area_show = !equipment_area_show;
    clearCanvas();
    draw();
  },

  commit: () => {
    // 提交事件
    console.log(allElementCollection);
  },

  // 清除整个画布
  clearAll: () => {
    allElementCollection = [];
    clearCanvas();
  },

  // 数据回显
  echoData: (data) => {},
};

export default canvasDraw;
