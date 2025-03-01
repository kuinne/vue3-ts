import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return () => (
      <div>
        <svg
          version="1.1"
          baseProfile="full"
          width="300"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="10" width="30" height="30" rx="10" ry="10"></rect>
          <circle cx="25" cy="75" r="20"></circle>
          <ellipse cx="25" cy="75" rx="20" ry="5"></ellipse>
          <line
            x1="10"
            x2="50"
            y1="110"
            y2="150"
            stroke="black"
            stroke-width="5"
          ></line>
          <polyline points="60, 110 65, 120 70, 115 75, 130 80, 125 85, 140 90, 135 95, 150 100, 145" />
          <polygon points="50, 160 55, 180 70, 180 60, 190 65, 205 50, 195 35, 205 40, 190 30, 180 45, 180"></polygon>
          <path
            d="M20,230 Q40,205 50,230 T90,230"
            fill="none"
            stroke="blue"
            stroke-width="5"
          ></path>
        </svg>
      </div>
    );
  },
});
