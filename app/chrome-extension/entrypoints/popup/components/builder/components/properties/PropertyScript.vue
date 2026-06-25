<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label"></label>
      <textarea
        class="form-textarea"
        v-model="(node as any).config.code"
        rows="6"
        placeholder="// your JS code"
      ></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">thực thi</label>
      <select class="form-select" v-model="(node as any).config.world">
        <option value="ISOLATED">ISOLATED</option>
        <option value="MAIN">MAIN</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">thực thithời điểm</label>
      <select class="form-select" v-model="(node as any).config.when">
        <option value="before">before</option>
        <option value="after">after</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">lưubiến(tùy chọn)</label>
      <input class="form-input" v-model="(node as any).config.saveAs" placeholder="biến" />
    </div>
    <div class="form-group">
      <label class="form-label">kết quảtrườngánh xạ</label>
      <KeyValueEditor v-model="(node as any).config.assign" />
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import type { NodeBase } from '@/entrypoints/background/record-replay/types';
import KeyValueEditor from '@/entrypoints/popup/components/builder/components/KeyValueEditor.vue';

defineProps<{ node: NodeBase }>();
</script>

<style scoped></style>
