<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">phần tửbộ chọn</label>
      <input class="form-input" v-model="(node as any).config.selector" placeholder="CSS bộ chọn" />
    </div>
    <div class="form-group">
      <label class="form-label">danh sáchbiếnnoiDungTiengViet</label>
      <input
        class="form-input"
        v-model="(node as any).config.saveAs"
        placeholder="mặc định elements"
      />
    </div>
    <div class="form-group">
      <label class="form-label">vòng lặpnoiDungTiengVietbiếnnoiDungTiengViet</label>
      <input
        class="form-input"
        v-model="(node as any).config.itemVar"
        placeholder="mặc định item"
      />
    </div>
    <div class="form-group">
      <label class="form-label">noiDungTiengViet ID</label>
      <input
        class="form-input"
        v-model="(node as any).config.subflowId"
        placeholder="noiDungTiengViet"
      />
      <button class="btn-sm" style="margin-top: 8px" @click="onCreateSubflow"
        >noiDungTiengViet</button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import type { NodeBase } from '@/entrypoints/background/record-replay/types';

const props = defineProps<{ node: NodeBase }>();
const emit = defineEmits<{ (e: 'create-subflow', id: string): void }>();

function onCreateSubflow() {
  const id = prompt('noiDungTiengVietđầu vàonoiDungTiengVietID');
  if (!id) return;
  emit('create-subflow', id);
  const n = props.node as any;
  if (n && n.config) n.config.subflowId = id;
}
</script>

<style scoped></style>
