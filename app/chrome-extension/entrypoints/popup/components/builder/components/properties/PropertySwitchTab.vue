<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">Tab ID(tùy chọn)</label>
      <input
        class="form-input"
        type="number"
        v-model.number="(node as any).config.tabId"
        placeholder="số"
      />
    </div>
    <div class="form-group" :class="{ invalid: needOne && !hasAny }">
      <label class="form-label">URL bao gồm(tùy chọn)</label>
      <input class="form-input" v-model="(node as any).config.urlContains" placeholder="khớp" />
    </div>
    <div class="form-group" :class="{ invalid: needOne && !hasAny }">
      <label class="form-label">tiêu đềbao gồm(tùy chọn)</label>
      <input class="form-input" v-model="(node as any).config.titleContains" placeholder="khớp" />
    </div>
    <div
      v-if="needOne && !hasAny"
      class="text-xs text-slate-500"
      style="padding: 0 20px; color: var(--rr-danger)"
      >cần cung cấp tabId URL/tiêu đềbao gồm</div
    >
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import { computed } from 'vue';
import type { NodeBase } from '@/entrypoints/background/record-replay/types';

const props = defineProps<{ node: NodeBase }>();
const needOne = true;
const hasAny = computed(() => {
  const c: any = (props.node as any).config || {};
  return !!(c.tabId || c.urlContains || c.titleContains);
});
</script>

<style scoped></style>
