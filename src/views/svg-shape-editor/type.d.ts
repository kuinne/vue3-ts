import { Component, FunctionalComponent } from "vue";

// 尺寸
export interface ISize {
  width: number;
  height: number;
}

// 坐标
export interface ICoordinate {
  x: number;
  y: number;
}

// 宽高和定位坐标
export interface ISizeCoordinate {
  width: number;
  height: number;
  x: number;
  y: number;
}

// 精灵通用属性： 大小、位置、旋转角
export interface ISpriteAttrs {
  size: ISize;
  coordinate: ICoordinate;
  angle: number;
}

// 精灵
export interface ISprite<IProps = any> {
  id: string;
  type: string;
  props: IProps;
  attrs: ISpriteAttrs;
}

// 精灵基类
export interface IBaseSpriteProps<IProps> {
  sprite: ISprite<IProps>;
  stage: any;
  active?: boolean;
  editing?: boolean;
}

export interface ISpriteMeta<IProps = any> {
  type: string;
  spriteComponent: FunctionalComponent<any>;
  initProps?: IProps;
  initAttrs?: ISpriteAttrs;
}

// 默认图形props
export interface IDefaultGraphicProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  strokeDasharray?: string;
  strokeLinecap?: "butt" | "round" | "square";
  defaultStrokeLinecap: "butt" | "round" | "square";
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type IStageApis = any;
