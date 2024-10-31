import { FormContext, FormItemContext } from "./type.d";
import { InjectionKey } from "vue";
export const formContextKey: InjectionKey<FormContext> =
  Symbol("formContextKey");

export const formItemContextKey: InjectionKey<FormItemContext> =
  Symbol("formItemContextKey");
