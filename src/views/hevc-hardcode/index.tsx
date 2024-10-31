import { defineComponent, onMounted } from "vue";
import videoUrl from './911Mothers_2010W-480p_h265.mp4'
import videoUrl2 from './911Mothers_2010W-480p.mp4'
import VConsole from "vconsole";
export default defineComponent({
    setup() {

        const check = () => {
            const videoEl = document.createElement('video')
            const canPlay = videoEl.canPlayType('video/mp4; codecs="hevc"')

            
            return /(maybe|Probably)/i.test(canPlay)
        }

        onMounted(() => {
            new VConsole()
            console.log('userAgent', navigator.userAgent)
            console.log('support hevc', check())

            
        })
        return () => <div>
            <h3>h265</h3>
            <video src={videoUrl} controls height={200}></video>
            <br/>
            <br/>
            <h3>h264</h3>
            <video src={videoUrl2} controls height={200}></video>
        </div>
    }
})