<template>
  <v-card elevation="0" class="my-2">
    <v-card-text
        :class="['dropZone', 'py-3', dragging ? 'overlay' : '']"
        @dragenter="dragging = true"
        @dragleave="dragging = false"
    >
      <div class="d-flex justify-center" @drag="onChange">
        <v-icon large left>mdi-cloud-upload-outline</v-icon>

        <span>
                    Перетащите или нажмите для загрузки
                    <br/>
                    Максимальный размер файлов: {{ size }}MB
                </span>
      </div>
      <input type="file" @change="onChange" :multiple="multiple"/>
    </v-card-text>

    <v-card-text v-if="files.length > 0" class="">
      <div class="d-flex pb-2" v-for="(file, index) in files" :key="index">
        <!--        <v-icon x-large left>mdi-file-outline</v-icon>-->
        <img :src="getImgSrc(file)" style="width:10vw" v-if="disablePreview">
        <span class="ml-3">
                    <div>
                        Имя файла: {{ truncate(file.name, 10, '...') }}
                        <br/>
                        Размер: {{ calculateFileSize(file.size) }}
                    </div>
                    <v-btn color="error" x-small @click="removeFile(file)">
                        Удалить
                    </v-btn>
                </span>
        <v-icon right class="ml-auto success--text">
          mdi-cloud-check-outline
        </v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from "lodash";
import truncate from "./helpers/truncate";

export default {
  name: "DropZone",
  props: {
    disablePreview: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 5,
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: "",
      files: [],
      dragging: false,
    };
  },
  methods: {
    getImgSrc(file) {
      return URL.createObjectURL(file)
    },
    calculateFileSize(size) {
      return (size / 1000000).toFixed(2) + "MB";
    },
    truncate(text, length, clamp) {
      return truncate(text, length, clamp)
    },
    onChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.dragging = false;
        return;
      }
      this.createFiles(files);
    },
    createFiles(files) {
      if (!files.length) {
        this.dragging = false;
        return;
      }
      _.forEach(files, (file) => {
        if (file.size > this.size * 1000000) {
          alert("please check file size no over 5 MB.");
          this.dragging = false;
          return;
        }
        if (!this.multiple) {
          this.files = []
        }
        this.files.push(file);
        this.dragging = false;
      })
      this.$emit("input", this.files);
    },
    removeFile(file) {
      let index = this.files.findIndex((fileObject) => file.name === fileObject.name)
      this.files.splice(index, 1);
      this.$emit("input", this.files);
    },
  },
};
</script>

<style scoped lang="scss">
.dropZone {
  position: relative;
  border: 5px dashed #eee;

  &:hover {
    border: 5px dashed #2e94c4;
  }

  .overlay {
    background: #5c5c5c;
    opacity: 0.8;
  }
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
