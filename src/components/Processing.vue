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
      <div class="flex items-center justify-center space-x-5 p-5 px-3">
        <div class="text-lg text-white">相片載入中</div>
        <svg
          class="h-6 w-6 animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-100"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formOpen: { default: true },
  },
};
</script>

<style></style>
