<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">phần tửbộ chọn(tùy chọn)</label>
      <input class="form-input" v-model="(node as any).config.selector" placeholder="rỗng" />
    </div>
    <div class="form-group checkbox-group">
      <label class="checkbox-label"
        ><input type="checkbox" v-model="(node as any).config.fullPage" /> ảnh chụp màn hình</label
      >
    </div>
    <div class="form-group">
      <label class="form-label">lưubiến</label>
      <input
        class="form-input"
        v-model="(node as any).config.saveAs"
        placeholder="biến, ví dụ shot"
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
