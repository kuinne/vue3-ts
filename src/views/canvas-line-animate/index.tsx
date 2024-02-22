import { cloneDeep } from "lodash";
import { defineComponent, ref, watch } from "vue";
import * as zrender from "zrender";

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement>();
    const zr = ref<any>();

    const init = () => {
      if (!canvas.value) return;
      zr.value = zrender.init(canvas.value);
      canvas.value.width = 1200;
      canvas.value.height = 800;
    };

    const renderCircle = () => {
      if (!canvas.value || !zr.value) return;

      const circle = new zrender.Circle({
        shape: {
          cx: 150,
          cy: 50,
          r: 40,
        },
        style: {
          fill: "red",
          stroke: "#f00",
        },
      });
      zr.value.add(circle);

      circle
        .animate("shape", true)
        .when(10000, { cx: 800 })
        .during((obj, i) => {})
        .start();
    };

    const renderPolyline = () => {
      if (!canvas.value || !zr.value) return;

      const points = [
        [334, 374],
        [463, 374],
        [463, 346],
        [541, 346],
        [541, 361],
      ];

      let accLenList = calPointsDistance();
      let percentList = calPointsDistancePercent();

      // 直线
      const line = new zrender.Polyline({
        shape: {
          points,
        },
        style: {
          stroke: "#FF6EBE",
        },
      });

      // 三角形
      const triangle = new zrender.Polygon({
        shape: {
          points: [
            [0, -5],
            [5, 0],
            [-5, 0],
          ],
        },
        style: {
          fill: "blue",
        },
        z: 2,
      });

      // ZRender以逆时针为正
      triangle.rotation = -Math.PI / 2;
      triangle.position = [points[0][0], points[0][1]];

      let frame = 1;
      triangle.__t = 0;
      triangle
        .animate("", true)
        .when(3000, { __t: 1 })
        .during((obj, i) => {
          // 判断当前帧是在哪段曲线内，并计算当前线段内的运动轨迹
          for (let j = 1; j < percentList.length; j++) {
            if (i > percentList[j - 1] && i < percentList[j]) {
              frame = j;
              break;
            }
          }

          // 通过 Math.atan2 函数计算折线之间的拐角度数

          const angle = -Math.atan2(
            points[frame][1] - points[frame - 1][1],
            points[frame][0] - points[frame - 1][0]
          );

          triangle.rotation =
            angle - Math.PI / 2 /** - Math.PI / 2 : ZRender以逆时针为正 */;

          zrender.vector.lerp(
            triangle.position,
            points[frame - 1],
            points[frame],
            (i - percentList[frame - 1]) /
              (percentList[frame] - percentList[frame - 1])
          );
        })
        .start();

      zr.value.add(line);
      zr.value.add(triangle);

      // 计算每个坐标带点到起始点之间的距离之和
      function calPointsDistance() {
        let accLenList = [0];
        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];
          const dist = zrender.vector.dist(p1, p2);
          accLenList.push(accLenList[i - 1] + dist);
        }
        return accLenList;
      }
      // 计算运动到每个点时，所占总运动距离的比例：
      function calPointsDistancePercent() {
        let percentList = accLenList.map((acc) => {
          return acc / accLenList[accLenList.length - 1];
        });
        return percentList;
      }
    };

    watch(canvas, () => {
      init();

      renderCircle();
      renderPolyline();
    });
    return () => <canvas ref={canvas}></canvas>;
  },
});
