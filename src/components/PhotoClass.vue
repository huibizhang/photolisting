<template>
  <div>
    <div class="flex items-center justify-between bg-stone-800 p-2 px-4">
      <div class="flex items-center space-x-3 text-xl text-gray-300">
        <div
          class="flex-1 text-xl text-gray-300"
          @dblclick="renameEditor = true && !spanable"
        >
          <span v-if="!renameEditor">{{ title }}</span>
          <input
            v-if="renameEditor"
            type="text"
            v-model="name"
            class="border-b border-blue-500 bg-transparent outline-none"
            @keypress.enter="renameEditor = false"
          />
        </div>
        <div
          v-if="spanable"
          class="h-5 w-5 cursor-pointer text-gray-500"
          @click="$emit('unusedListOpenClicked')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-full w-full transition-all"
            :class="[unusedListOpened && 'rotate-90']"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
      <div class="text-xs text-gray-500">
        {{ itemCount }}
        個項目
      </div>
    </div>
    <div
      v-if="(unusedListOpened && spanable) || !spanable"
      class="grid min-h-0 w-screen grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
    >
      <label
        class="flex aspect-[3/4] w-full border border-stone-900 bg-stone-800 transition-all"
        v-for="f in files"
        :key="f.url"
        @contextmenu.prevent="
          $emit('contextmenuClicked', { $event, index: f.index })
        "
      >
        <input
          type="checkbox"
          name="img"
          id=""
          :checked="f.checked"
          @change="
            $emit('checked', { index: f.index, value: $event.target.checked })
          "
          class="peer appearance-none"
        />
        <div
          class="flex h-full w-full flex-col transition-all peer-checked:bg-stone-700"
        >
          <div class="flex min-h-0 flex-1 items-center justify-center p-3">
            <div
              class="relative flex"
              :class="f.width > f.height ? 'w-full' : 'h-full'"
              :style="{ 'aspect-ratio': `${f.width}/${f.height}` }"
            >
              <img
                :src="f.url"
                alt=""
                class="h-full w-full object-contain"
                @load="$emit('load', { $event, index: f.index })"
              />
              <div
                class="pointer-events-none absolute h-full w-full border-2 transition-all"
                :class="[f.checked ? 'opacity-100' : 'opacity-0']"
              >
                <div class="h-full w-full border"></div>
              </div>
            </div>
          </div>
          <div class="flex justify-center p-2 text-stone-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-3 w-3"
              v-for="i in 5"
              :class="[i <= f.rating && 'text-stone-300']"
              :key="`star${i + 1}-${f.index}`"
            >
              <path
                fill-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: { default: [] },
    title: { default: "標題" },
    itemCount: { default: "0" },
    spanable: { default: false },
    unusedListOpened: { default: false },
  },
  data() {
    return {
      name: this.title,
      renameEditor: false,
    };
  },
  watch: {
    name(newVal) {
      this.$emit("rename", newVal);
    },
  },
};
</script>

<style></style>
