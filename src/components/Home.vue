<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center transition-all"
  >
    <div
      class="text-xl text-gray-200"
      :class="loaded ? 'opacity-100 duration-700' : 'opacity-0'"
    >
      相片列表是空的
    </div>
    <div
      class="relative flex h-36 w-36 text-gray-200 transition-all"
      :class="loaded ? 'opacity-100 duration-700' : 'opacity-0'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="0.7"
        stroke="currentColor"
        class="h-full w-full"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.5"
        stroke="currentColor"
        class="absolute -left-1 top-9 h-10 w-10 rounded-full bg-stone-900"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <label
      class="active:bg-blue-70 cursor-pointer rounded-full bg-blue-500 px-5 py-1 font-mono text-sm font-black text-white transition-all hover:bg-blue-600"
      :class="loaded ? 'opacity-100 duration-700' : 'opacity-0'"
    >
      <input
        ref="file"
        type="file"
        webkitdirectory="true"
        @click.prevent="$emit('selectDir')"
        class="sr-only"
      />
      <span>選取目錄</span>
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.loaded = true;
    }, 500);
  },
};
</script>

<style></style>
