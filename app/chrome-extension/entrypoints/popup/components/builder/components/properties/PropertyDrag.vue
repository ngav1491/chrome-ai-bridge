<template>
  <div>
    <SelectorEditor :node="node" :allowPick="true" title="điểm bắt đầubộ chọn" targetKey="start" />
    <SelectorEditor
      :node="node"
      :allowPick="true"
      title="noiDungTiengVietbộ chọn"
      targetKey="end"
    />
    <div class="hint">
      <small
        >gợi ý：đường dẫn（path）noiDungTiengVietghinoiDungTiengViettự độngtạo，thủ
        côngtạonoiDungTiengViet。</small
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import type { NodeBase } from '@/entrypoints/background/record-replay/types';
import SelectorEditor from './SelectorEditor.vue';

defineProps<{ node: NodeBase }>();
</script>

<style scoped>
.hint {
  color: #64748b;
  margin-top: 8px;
}
</style>
