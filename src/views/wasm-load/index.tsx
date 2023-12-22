import { defineComponent } from "vue";
import wasmUrl from "./simple.wasm?url";
export default defineComponent({
    setup() {
        const importObject = {
            imports: {
                imported_func: arg => {
                    console.log(arg);
                    
                }
            }
        }
        WebAssembly.instantiateStreaming(fetch(wasmUrl), importObject).then(obj => {
            obj.instance.exports.exported_func();
        })
       
        return () => <div>sss</div>
    }
})