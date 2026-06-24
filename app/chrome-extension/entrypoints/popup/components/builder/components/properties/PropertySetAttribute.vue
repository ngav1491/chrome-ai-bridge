<template>
  <div>
    <SelectorEditor :node="node" :allowPick="true" />
    <div class="form-section">
      <div class="form-group">
        <label class="form-label">thuộc tínhnoiDungTiengViet</label>
        <input
          class="form-input"
          v-model="(node as any).config.name"
          placeholder="noiDungTiengViet value/src/disabled noiDungTiengViet"
        />
      </div>
      <div class="form-group">
        <label class="form-label"
          >thuộc tínhnoiDungTiengViet（noiDungTiengVietxóanoiDungTiengVietgỡ bỏ）</label
        >
        <input
          class="form-input"
          v-model="(node as any).config.value"
          placeholder="thuộc tínhnoiDungTiengViet"
        />
      </div>
      <div class="form-group checkbox-group">
        <label class="checkbox-label"
          ><input type="checkbox" v-model="(node as any).config.remove" /> xóathuộc tính</label
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import type { NodeBase } from '@/entrypoints/background/record-replay/types';
import SelectorEditor from './SelectorEditor.vue';

defineProps<{ node: NodeBase }>();
</script>

<style scoped></style>
