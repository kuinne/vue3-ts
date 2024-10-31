export interface Rule {
  validate: (value: string) => boolean;
  message: string;
}

export interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  rules: Record<string, Rule[]>;
}

export interface FormContext {
  formState: FormState;
  registerField: (field: string, rules: Rule[]) => void;
  validateField: (field: string) => void;
  onChange: () => void;
}

export interface FormItemContext {
  value: any;
  error: string;
  updateValue: (value: any) => void;
  validate: () => void;
}
