<template>
  <div
    class="relative flex h-screen min-h-0 w-full select-none flex-col overflow-hidden bg-stone-900"
  >
    <!-- 視窗標題列 -->
    <div
      class="absolute flex h-7 w-full items-center px-2 text-xs text-white"
      :style="{ '-webkit-app-region': 'drag' }"
    >
      <img src="/icon.ico" class="mr-1.5 h-5 w-5" />

      Photolisting
    </div>

    <!-- 選擇相片庫 主畫面 -->
    <Home v-if="!files.length" @selectDir="selectDir" />

    <!-- 相片列表 -->
    <div
      class="flex h-screen max-h-screen w-screen flex-col overflow-hidden pt-8"
      v-if="files.length"
    >
      <div
        class="mb-1 flex items-center justify-end bg-stone-800 p-2 px-4 text-xs text-gray-300"
      >
        最低可用評分：
        <input
          type="number"
          max="6"
          min="0"
          v-model="lowestRating"
          class="border-b border-blue-600 bg-transparent text-center"
        />
      </div>

      <div
        class="h-full w-full flex-1 space-y-2 overflow-hidden overflow-y-auto"
      >
        <PhotoClass
          v-for="r in 5 - lowestRating + 1"
          :key="`classfy-${r}`"
          :title="nameDict[4 - r + 2]"
          :itemCount="`${
            getCheckedFilesByRating(4 - r + 2).length > 0
              ? `${getCheckedFilesByRating(4 - r + 2).length}/`
              : ''
          }${getFilesByRating(4 - r + 2).length}`"
          :files="getFilesByRating(4 - r + 2)"
          @load="imgOnLoad($event.$event, $event.index)"
          @checked="fileChecked($event)"
          @contextmenuClicked="contextMenu($event.$event, $event.index)"
          @rename="nameDict[4 - r + 2] = $event"
        />

        <!-- file unused -->
        <PhotoClass
          class="pt-5"
          :key="`classfy-unused`"
          title="未使用"
          :itemCount="`${
            getCheckedFilesUnused().length > 0
              ? `${getCheckedFilesUnused().length}/`
              : ''
          }${getFilesUnused().length}`"
          :files="getFilesUnused()"
          spanable="true"
          :unusedListOpened="unusedListOpened"
          @unusedListOpenClicked="unusedListOpened = !unusedListOpened"
          @load="imgOnLoad($event.$event, $event.index)"
          @checked="fileChecked($event)"
          @contextmenuClicked="contextMenu($event.$event, $event.index)"
        />
      </div>

      <div
        class="flex w-full flex-none justify-end border-t-2 border-stone-900 bg-stone-700 p-3"
      >
        <button
          class="rounded-full bg-blue-500 px-5 py-1 font-mono text-sm font-black text-white transition-all hover:bg-blue-600 active:bg-blue-700"
          @click="listingConfirm"
        >
          確定
        </button>
      </div>
    </div>
    <div
      ref="contextMenu"
      class="absolute rounded bg-gray-200 px-2 py-1 text-sm transition-opacity"
      :class="[!menuOpened && 'pointer-events-none opacity-0']"
      :style="menuPosition"
    >
      <div
        class="cursor-pointer rounded px-8 py-1 hover:bg-gray-300"
        v-for="mc of menuContents"
        :key="mc.text"
        @click="changeRating(mc.value)"
      >
        {{ mc.text }}
      </div>
    </div>
    <UpdateForm
      v-bind="updateInfo"
      :formOpen="updateForm"
      @cancel="updateForm = false"
    />

    <div
      class="absolute bottom-3 left-3 flex justify-center rounded-full border border-stone-500 px-4 py-1 text-white transition-all hover:bg-white/10 active:scale-95 active:bg-white/30 active:text-blue-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-5 w-5 transition-all"
      >
        <path
          d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import exifr from "exifr/dist/full.esm";
import Home from "./components/Home.vue";
import PhotoClass from "./components/PhotoClass.vue";
import UpdateForm from "./components/UpdateForm.vue";

// https://github.com/huibizhang/photolisting/releases/download/v0.0.0/photolisting-Setup-0.0.0.exe

export default {
  data() {
    return {
      directory: null,
      files: [],
      nameDict: {
        5: "A",
        4: "B",
        3: "C",
        2: "D",
        1: "E",
        0: "F",
      },
      dictNameEditor: {
        5: false,
        4: false,
        3: false,
        2: false,
        1: false,
        0: false,
      },
      menuPosition: {
        top: "0px",
        left: "0px",
      },
      menuSize: {
        width: 0,
        height: 0,
      },
      menuContents: [
        { text: "設為 無", value: 0 },
        { text: "設為 1 星", value: 1 },
        { text: "設為 2 星", value: 2 },
        { text: "設為 3 星", value: 3 },
        { text: "設為 4 星", value: 4 },
        { text: "設為 5 星", value: 5 },
      ],
      menuOpened: false,
      currentPic: 0,
      operationTime: new Date(),
      lowestRating: 2,
      unusedListOpened: false,
      savePath: undefined,
      updateInfo: {},
      updateForm: false,
    };
  },
  mounted() {
    this.checkUpdate();

    const contextMenu = this.$refs.contextMenu;
    this.menuSize.width = contextMenu?.offsetWidth;
    this.menuSize.height = contextMenu?.offsetHeight;
    this.preloadDirectory();
  },
  methods: {
    async selectDir() {
      const checkPath = window.ipcRenderer.sendSync("selectDir", "");
      console.log(checkPath);
      if (checkPath) {
        this.preloadDirectory();
      }
    },
    imgOnLoad(e, index) {
      this.files[index].width = e.target.naturalWidth;
      this.files[index].height = e.target.naturalHeight;

      // console.log(
      //   index,
      //   this.files[index].rating,
      //   Number.isInteger(this.files[index].rating)
      // );

      if (!Number.isInteger(this.files[index].rating)) {
        this.files[index].rating = this.files[index].exif?.Rating;
      }

      console.log(this.files[index]);
    },
    getFilesByRating(rating) {
      return this.files.filter(
        (f) =>
          (Number.isInteger(f.rating) ? f.rating : f.exif?.Rating) === rating
      );
    },
    getCheckedFilesByRating(rating) {
      return this.files.filter(
        (f) =>
          (Number.isInteger(f.rating) ? f.rating : f.exif?.Rating) === rating &&
          f.checked
      );
    },
    getFilesUnused() {
      return this.files.filter(
        (f) =>
          (Number.isInteger(f.rating) ? f.rating : f.exif?.Rating) <
          this.lowestRating
      );
    },
    getCheckedFilesUnused() {
      return this.files.filter(
        (f) =>
          (Number.isInteger(f.rating) ? f.rating : f.exif?.Rating) <
            this.lowestRating && f.checked
      );
    },
    getCheckedFiles() {
      return this.files.filter((f) => f.checked);
    },
    contextMenu(e, i) {
      // if (this.getCheckedFilesByRating(rating).length <= 1) {
      //   this.getCheckedFilesByRating(rating).forEach((f) => {
      //     this.files[f.index].checked = f.index === i;
      //   });
      // }

      this.menuOpened = true;
      // this.currentPic = i;

      if (!this.files[i].checked) {
        this.fileChecked({ index: i, value: true });
      }

      console.log(this.menuSize.width, e.clientX, window.innerWidth);

      if (e.clientX + this.menuSize.width > window.innerWidth) {
        this.menuPosition.left = `${
          window.innerWidth - this.menuSize.width - 5
        }px`;
      } else {
        this.menuPosition.left = `${e.clientX}px`;
      }

      if (e.clientY + this.menuSize.height > window.innerHeight) {
        this.menuPosition.top = `${
          window.innerHeight - this.menuSize.height - 5
        }px`;
      } else {
        this.menuPosition.top = `${e.clientY}px`;
      }
    },
    async preloadDirectory() {
      const [files, dir] = await window.electronAPI.preloadDirectory();

      this.savePath = dir;

      for (let i = 0; i < files?.length; i++) {
        this.files.push(await this.createFile(files[i], i));

        // reader.onload = async function (ev) {
        //   _this.files[i].url = ev.target.result;
        //   //
        // };

        // reader.readAsDataURL(files[i]);
      }
    },
    changeRating(nextRating) {
      // const index = this.currentPic;
      // this.files[index].rating = nextRating;

      this.getCheckedFiles().forEach(
        (f) => (this.files[f.index].rating = nextRating)
      );
    },
    async createFile(file, index) {
      // console.log(file);

      return {
        index: index,
        name: file.name,
        url: await exifr.thumbnailUrl(file),
        exif: await exifr.parse(file, true),
        width: 1,
        height: 1,
        checked: false,
        rating: undefined,
        raw: file,
      };
    },
    listingConfirm() {
      const finalList = this.files
        .filter((f) => f.rating >= this.lowestRating)
        .map((f) => {
          return {
            oldName: f.name,
            newName: `${this.nameDict[f.rating]}_${f.name}`,
          };
        });

      console.log(finalList);
      window.ipcRenderer.send("save", finalList);
    },
    checkUpdate() {
      window.electronAPI.checkUpdate((evt, arg) => {
        this.updateInfo = arg;
        this.updateForm = arg.currentVersion < arg.targetVersion;
        console.log(this.updateForm);
      });
    },
    fileChecked(event) {
      const { index, value, modifier } = event;

      if (modifier === "ctrl") {
        this.files[index].checked = value;
      } else {
        let first = -1;
        const selected = this.getCheckedFiles().length;

        this.files.forEach((file) => {
          if (first === -1 && file.checked) {
            first = file.index;
          }

          if (modifier === "shift") {
            this.files[file.index].checked =
              first !== -1 && first <= file.index && file.index <= index;
          } else {
            this.files[file.index].checked =
              (file.index === index && value) ||
              (file.index === index && selected > 1);
          }
        });
      }
    },
  },
  watch: {
    menuOpened(value) {
      if (value) {
        document.body.addEventListener(
          "click",
          () => (this.menuOpened = false)
        );
      } else {
        document.body.removeEventListener(
          "click",
          () => (this.menuOpened = false)
        );
      }
    },
  },
  components: { Home, PhotoClass, UpdateForm },
};
</script>
