export type FormLayout =
  /** 水平布局（标签（Label）和控件（Input/Select等）在同一行） */
  | "horizontal"
  /** 垂直布局（标签在上方，控件在下方） */
  | "vertical"
  /** 栅格布局（分栏排列，可定义每项占据的列数和行数） */
  | "grid";

type Validator = (value: any) => string | Promise<string>;
export interface FormRule {
  required?: boolean;
  pattern?: RegExp;
  validator?: Validator;
  message?: string;
  trigger?: "blur" | "change";
}

export interface FormProps {
  model: Record<string, any>;
  rules?: Record<string, FormRule[]>;
  layout?: FormLayout;
  labelPosition?: "left" | "right" | "top";
}
