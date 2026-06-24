<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">noiDungTiengViet URL bao gồmkhớp（ưu tiên）</label>
      <input
        class="form-input"
        v-model="(node as any).config.frame.urlContains"
        placeholder="frame URL bao gồmnoiDungTiengVietchuỗi"
      />
    </div>
    <div class="form-group">
      <label class="form-label"
        >noiDungTiengVietchỉ mụckhớp（noiDungTiengViet 0 noiDungTiengViet，noiDungTiengViet
        frame）</label
      >
      <input
        class="form-input"
        v-model="(node as any).config.frame.index"
        placeholder="chỉ mụcsố"
      />
    </div>
    <div class="text-xs text-slate-500" style="padding: 0 20px"
      >noiDungTiengViet/noiDungTiengViet frame có sẵn；noiDungTiengViettrang</div
    >
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import type { NodeBase } from '@/entrypoints/background/record-replay/types';
defineProps<{ node: NodeBase }>();
</script>

<style scoped></style>
