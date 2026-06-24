<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">phần tửbộ chọn（tùy chọn）</label>
      <input class="form-input" v-model="(node as any).config.selector" placeholder="CSS bộ chọn" />
    </div>
    <div class="form-group">
      <label class="form-label">thuộc tính</label>
      <input
        class="form-input"
        v-model="(node as any).config.attr"
        placeholder="text/textContent noiDungTiengVietthuộc tínhnoiDungTiengViet"
      />
    </div>
    <div class="form-group">
      <label class="form-label">noiDungTiengVietđịnh nghĩa JS（trả vềnoiDungTiengViet）</label>
      <textarea
        class="form-textarea"
        v-model="(node as any).config.js"
        rows="3"
        placeholder="return document.title"
      ></textarea>
    </div>
    <div class="form-group" :class="{ invalid: !(node as any).config?.saveAs }">
      <label class="form-label">lưunoiDungTiengVietbiến</label>
      <input
        class="form-input"
        v-model="(node as any).config.saveAs"
        placeholder="biếnnoiDungTiengViet"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import type { NodeBase } from '@/entrypoints/background/record-replay/types';
defineProps<{ node: NodeBase }>();
</script>

<style scoped></style>
