<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">tệpnoiDungTiengVietbao gồm（tùy chọn）</label>
      <input
        class="form-input"
        v-model="(node as any).config.filenameContains"
        placeholder="noiDungTiengVietkhớptệpnoiDungTiengVietURL"
      />
    </div>
    <div class="form-group">
      <label class="form-label">hết thời gian(ms)</label>
      <input
        class="form-input"
        v-model="(node as any).config.timeoutMs"
        placeholder="mặc định 60000"
      />
    </div>
    <div class="form-group checkbox-group">
      <label class="checkbox-label"
        ><input type="checkbox" v-model="(node as any).config.waitForComplete" /> chờtải xuốnghoàn
        tất</label
      >
    </div>
    <div class="form-group">
      <label class="form-label">lưunoiDungTiengVietbiến</label>
      <input
        class="form-input"
        v-model="(node as any).config.saveAs"
        placeholder="mặc định download"
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
