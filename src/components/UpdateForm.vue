<template>
  <div
    class="absolute left-0 top-0 z-20 flex h-screen w-screen items-center justify-center p-5 transition-all"
    :class="formOpen ? '' : 'pointer-events-none opacity-0'"
  >
    <div class="absolute left-0 top-0 h-full w-full bg-black/50"></div>
    <div
      class="z-10 flex w-full max-w-sm flex-col items-center overflow-hidden rounded-lg bg-stone-800 shadow-md transition-all"
      :class="formOpen ? 'delay-150' : 'scale-0'"
    >
      <div class="p-3 text-center text-stone-300">版本更新</div>
      <div class="grid w-fit grid-cols-3 pb-3">
        <div class="text-center text-2xl text-stone-500">
          {{ currentVersion }}
        </div>
        <div class="flex items-center justify-center text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <div class="text-center text-2xl text-white">{{ targetVersion }}</div>
        <div class="pt-1 text-center text-xs text-stone-500">目前版本</div>
        <div></div>
        <div class="pt-1 text-center text-xs text-stone-500">最新版本</div>
      </div>
      <div class="text-xs text-stone-500">發布日期：{{ publishDate }}</div>
      <div
        class="mt-3 flex w-full justify-end space-x-1 border-t border-stone-700 bg-stone-700/70 p-3"
      >
        <button
          class="cursor-pointer rounded-full px-5 py-1.5 font-mono text-xs text-stone-500 transition-all hover:text-stone-400 active:bg-white/10 active:text-white"
          @click="$emit('cancel')"
          v-if="!updating"
        >
          不，先不要
        </button>
        <button
          class="cursor-pointer overflow-hidden rounded-full font-mono text-xs font-black text-white transition-all"
          :class="
            updating
              ? 'h-1.5 w-full bg-stone-600'
              : 'bg-blue-500 px-5  py-1.5 hover:bg-blue-600  active:bg-blue-700'
          "
          @click="update"
          :disabled="updating"
        >
          <span v-if="!updating">開始更新</span>
          <div
            class="h-full bg-blue-400 transition-all"
            :style="{ width: `${progress * 100}%` }"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentVersion: { default: "0.0.0" },
    targetVersion: { default: "0.0.1" },
    publishedAt: { default: new Date().toString() },
    url: { default: "" },
    formOpen: { default: false },
  },
  data() {
    return {
      updating: false,
      progress: 0,
    };
  },
  computed: {
    publishDate() {
      const d = new Date(this.publishedAt);
      let day = d.getDate();
      let month = d.getMonth();
      let year = d.getFullYear();
      return `${year}/${month + 1}/${day}`;
    },
  },
  methods: {
    update() {
      if (this.updating) return;

      window.electronAPI.updating(this.url, (evt, arg) => {
        this.updating = true;
        this.progress = arg.progress;
      });
    },
  },
};
</script>

<style></style>
