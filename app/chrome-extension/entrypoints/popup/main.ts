import { createApp } from 'vue';
import { NativeMessageType } from 'chrome-mcp-shared';
import './style.css';
// noiDungTiengVietAgentChatnoiDungTiengViet
import '../sidepanel/styles/agent-chat.css';
import { preloadAgentTheme } from '../sidepanel/composables/useAgentTheme';
import App from './App.vue';

// noiDungTiengVietVuenoiDungTiengViet，noiDungTiengViet
preloadAgentTheme().then(() => {
  // Trigger ensure native connection (fire-and-forget, don't block UI mounting)
  void chrome.runtime.sendMessage({ type: NativeMessageType.ENSURE_NATIVE }).catch(() => {
    // Silent failure - background will handle reconnection
  });
  createApp(App).mount('#app');
});
