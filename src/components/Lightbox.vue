<template>
  <div
    class="absolute left-0 top-0 z-20 flex h-full w-screen items-center justify-center overflow-hidden p-5 transition-all"
    :class="formOpen ? '' : 'pointer-events-none opacity-0'"
    tabindex="0"
    v-focus="formOpen"
    @keydown.esc="$emit('cancel')"
  >
    <div
      class="absolute left-0 top-0 h-full w-full bg-black/75"
      @click="$emit('cancel')"
      @mousewheel="handleMouseWheel"
      @mousedown="pictureMove"
      @mousemove="pictureMove"
      @mouseup="pictureMove"
      @dragstart.prevent=""
    ></div>
    <img
      ref="img"
      :src="src"
      class="z-10 flex-col overflow-hidden shadow-md transition-all"
      :class="formOpen ? '' : 'scale-0'"
      :style="{
        transform: `scale(${scale}, ${scale}) translate(${movement.x}px, ${movement.y}px)`,
      }"
      @dblclick="
        () => {
          scale = 1;
          movement = { x: 0, y: 0 };
        }
      "
      @mousewheel="handleMouseWheel"
      @mousedown="pictureMove"
      @mousemove="pictureMove"
      @mouseup="pictureMove"
      @dragstart.prevent=""
    />
  </div>
</template>

<script>
export default {
  props: {
    formOpen: { default: false },
    files: { default: [] },
    index: { default: -1 },
  },
  data() {
    return {
      src: "",
      scale: 1,
      canMove: false,
      movement: {
        x: 0,
        y: 0,
      },
    };
  },
  mounted() {
    this.loadImage();
  },
  methods: {
    loadImage() {
      let src = "";

      if (this.index >= 0 && this.index < this.files.length) {
        src = this.files[this.index].url;

        var fr = new FileReader();
        fr.onload = () => {
          // console.log(fr);
          this.src = fr.result;
        };
        fr.readAsDataURL(this.files[this.index].raw);
      }

      this.src = src;
    },
    handleMouseWheel(event) {
      // 在滾輪事件觸發時執行的邏輯處理
      // console.log("Mouse wheel event:", event);
      const direction = 0 - event.deltaY;

      if (direction > 0) {
        this.scale += direction / 5000;
      } else if (direction < 0) {
        this.scale -= (0 - direction) / 5000;

        if (this.scale < 0) this.scale = 0;
      }

      const screen = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const computedStyle = window.getComputedStyle(this.$refs.img);
      const scaleX = parseFloat(computedStyle.transform.split("(")[1]);
      const scaleY = parseFloat(computedStyle.transform.split(",")[3]);
      const originalWidth = this.$refs.img.width;
      const originalHeight = this.$refs.img.height;
      const scaledWidth = originalWidth * scaleX;
      const scaledHeight = originalHeight * scaleY;

      if (scaledWidth < screen.width) {
        this.movement.x = 0;
      }
      if (scaledHeight < screen.height) {
        this.movement.y = 0;
      }
    },
    pictureMove(event) {
      // console.log(event);
      const { type, button, movementX, movementY } = event;

      const screen = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const computedStyle = window.getComputedStyle(this.$refs.img);
      const scaleX = parseFloat(computedStyle.transform.split("(")[1]);
      const scaleY = parseFloat(computedStyle.transform.split(",")[3]);
      const originalWidth = this.$refs.img.width;
      const originalHeight = this.$refs.img.height;
      const scaledWidth = originalWidth * scaleX;
      const scaledHeight = originalHeight * scaleY;

      if (button === 0) {
        if (type === "mousedown") {
          if (scaledWidth > screen.width || scaledHeight > screen.height) {
            this.canMove = true;
          }
        } else if (type === "mouseup") {
          this.canMove = false;
        } else if (type === "mousemove" && this.canMove) {
          const rect = this.$refs.img.getBoundingClientRect();

          if (scaledWidth > screen.width) {
            const maxMove = (scaledWidth - screen.width) / 2 + 16;

            this.movement.x += movementX;

            if (movementX > 0 && this.movement.x > maxMove) {
              this.movement.x = maxMove;
            } else if (movementX < 0 && this.movement.x < -maxMove) {
              this.movement.x = -maxMove;
            }

            // console.log(this.movement, maxMove, movementX);
            // console.log(rect.left, rect.right, maxMove);
          }

          if (scaledHeight > screen.height) {
            const maxMove = (scaledHeight - screen.height) / 2 + 16;

            this.movement.y += movementY;

            if (movementY > 0 && this.movement.y > maxMove) {
              this.movement.y = maxMove;
            } else if (movementY < 0 && this.movement.y < -maxMove) {
              this.movement.y = -maxMove;
            }
          }
        }
      }

      // console.log(type, button, movementX, movementY);
    },
  },
  watch: {
    index() {
      this.loadImage();
      this.scale = 1;
      this.movement = {
        x: 0,
        y: 0,
      };
    },
    formOpen(opened) {
      if (opened) {
        this.loadImage();
        this.scale = 1;
        this.movement = {
          x: 0,
          y: 0,
        };
      }
    },
  },
};
</script>

<style></style>
