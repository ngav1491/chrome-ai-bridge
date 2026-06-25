// node-specs-builtin.ts — builtin NodeSpecs shared for UI + runtime
import type { NodeSpec } from './node-spec';
import { registerNodeSpec } from './node-spec-registry';
import { STEP_TYPES } from './step-types';

export function registerBuiltinSpecs() {
  const nav: NodeSpec = {
    type: STEP_TYPES.NAVIGATE,
    version: 1,
    display: { label: 'điều hướng', iconClass: 'icon-navigate', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'url',
        label: 'URL',
        type: 'string',
        required: true,
        placeholder: 'https://example.com',
        help: 'mục tiêuđịa chỉ, hỗ trợbiếnmẫu {var}',
        default: '',
      },
    ],
    defaults: { url: '' },
    validate: (cfg) => {
      const errs: string[] = [];
      if (!cfg || !cfg.url || String(cfg.url).trim() === '') errs.push('URL bắt buộc');
      return errs;
    },
  };
  registerNodeSpec(nav);

  // Click / Dblclick
  registerNodeSpec({
    type: STEP_TYPES.CLICK,
    version: 1,
    display: { label: 'nhấp', iconClass: 'icon-click', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'target',
        label: 'mục tiêu',
        type: 'json',
        widget: 'targetlocator',
        help: 'đầu vàophần tửbộ chọn',
      },
      {
        key: 'before',
        label: 'thực thi',
        type: 'object',
        fields: [
          { key: 'scrollIntoView', label: 'cuộn', type: 'boolean', default: true },
          { key: 'waitForSelector', label: 'chờbộ chọn', type: 'boolean', default: true },
        ],
      },
      {
        key: 'after',
        label: 'thực thi',
        type: 'object',
        fields: [
          {
            key: 'waitForNavigation',
            label: 'chờđiều hướnghoàn tất',
            type: 'boolean',
            default: false,
          },
          {
            key: 'waitForNetworkIdle',
            label: 'chờ',
            type: 'boolean',
            default: false,
          },
        ],
      },
    ],
    defaults: { before: { scrollIntoView: true, waitForSelector: true }, after: {} },
  });
  registerNodeSpec({
    type: STEP_TYPES.DBLCLICK,
    version: 1,
    display: { label: 'nhấp đúp', iconClass: 'icon-click', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'target', label: 'mục tiêu', type: 'json', widget: 'targetlocator' },
      {
        key: 'before',
        label: 'thực thi',
        type: 'object',
        fields: [
          { key: 'scrollIntoView', label: 'cuộn', type: 'boolean', default: true },
          { key: 'waitForSelector', label: 'chờbộ chọn', type: 'boolean', default: true },
        ],
      },
      {
        key: 'after',
        label: 'thực thi',
        type: 'object',
        fields: [
          {
            key: 'waitForNavigation',
            label: 'chờđiều hướnghoàn tất',
            type: 'boolean',
            default: false,
          },
          {
            key: 'waitForNetworkIdle',
            label: 'chờ',
            type: 'boolean',
            default: false,
          },
        ],
      },
    ],
    defaults: { before: { scrollIntoView: true, waitForSelector: true }, after: {} },
  });

  // Fill
  registerNodeSpec({
    type: STEP_TYPES.FILL,
    version: 1,
    display: { label: 'điền', iconClass: 'icon-fill', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'target', label: 'mục tiêu', type: 'json', widget: 'targetlocator' },
      {
        key: 'value',
        label: 'đầu vào',
        type: 'string',
        required: true,
        help: 'hỗ trợ {var} mẫu',
      },
    ],
    defaults: { value: '' },
  });

  // Key
  registerNodeSpec({
    type: STEP_TYPES.KEY,
    version: 1,
    display: { label: '', iconClass: 'icon-key', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'keys',
        label: '',
        type: 'string',
        widget: 'keysequence',
        required: true,
        help: ' Backspace Enter  cmd+a',
      },
      {
        key: 'target',
        label: 'mục tiêu(tùy chọn)',
        type: 'json',
        widget: 'targetlocator',
      },
    ],
    defaults: { keys: '' },
  });

  // Scroll
  registerNodeSpec({
    type: STEP_TYPES.SCROLL,
    version: 1,
    display: { label: 'cuộn', iconClass: 'icon-scroll', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'mode',
        label: 'schema',
        type: 'select',
        options: [
          { label: 'phần tử', value: 'element' },
          { label: 'offset', value: 'offset' },
          { label: 'vùng chứa', value: 'container' },
        ] as any,
        default: 'offset',
      },
      {
        key: 'target',
        label: 'mục tiêu(phần tử/vùng chứa)',
        type: 'json',
        widget: 'targetlocator',
      },
      {
        key: 'offset',
        label: 'offset',
        type: 'object',
        fields: [
          { key: 'x', label: 'X', type: 'number' },
          { key: 'y', label: 'Y', type: 'number' },
        ],
      },
    ],
    defaults: { mode: 'offset', offset: { x: 0, y: 300 } },
  });

  // Drag
  registerNodeSpec({
    type: STEP_TYPES.DRAG,
    version: 1,
    display: { label: 'kéo thả', iconClass: 'icon-drag', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'start', label: 'điểm bắt đầu', type: 'json', widget: 'targetlocator' },
      { key: 'end', label: '', type: 'json', widget: 'targetlocator' },
      {
        key: 'path',
        label: 'đường dẫntọa độ',
        type: 'array',
        item: {
          key: 'p',
          label: '',
          type: 'object',
          fields: [
            { key: 'x', label: 'X', type: 'number' },
            { key: 'y', label: 'Y', type: 'number' },
          ],
        } as any,
      },
    ],
    defaults: {},
  });

  // Wait
  registerNodeSpec({
    type: STEP_TYPES.WAIT,
    version: 1,
    display: { label: 'chờ', iconClass: 'icon-wait', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'condition',
        label: 'điều kiện(JSON)',
        type: 'json',
        help: ' {"sleep":1000}  {"text":"Hello","appear":true}',
      },
    ],
    defaults: { condition: { sleep: 500 } },
  });

  // Assert
  registerNodeSpec({
    type: STEP_TYPES.ASSERT,
    version: 1,
    display: { label: 'khẳng định', iconClass: 'icon-assert', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }, { label: 'onError' }] },
    schema: [
      {
        key: 'assert',
        label: 'khẳng định(JSON)',
        type: 'json',
        help: ' {"exists":"#id"} / {"visible":".btn"}',
      },
      {
        key: 'failStrategy',
        label: 'thất bạichiến lược',
        type: 'select',
        options: [
          { label: 'dừng', value: 'stop' },
          { label: 'cảnh báo', value: 'warn' },
          { label: 'thử lại', value: 'retry' },
        ] as any,
        default: 'stop',
      },
    ],
    defaults: { assert: {} },
  });

  // HTTP
  registerNodeSpec({
    type: STEP_TYPES.HTTP,
    version: 1,
    display: { label: 'HTTP', iconClass: 'icon-http', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'method',
        label: 'phương thức',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => ({
          label: m,
          value: m,
        })) as any,
        default: 'GET',
      },
      { key: 'url', label: 'URL', type: 'string', required: true },
      { key: 'headers', label: 'yêu cầu(JSON)', type: 'json' },
      { key: 'body', label: 'yêu cầu(JSON)', type: 'json' },
      { key: 'formData', label: 'biểu mẫu(JSON)', type: 'json' },
      { key: 'saveAs', label: 'lưubiến', type: 'string' },
      { key: 'assign', label: 'ánh xạ(JSON)', type: 'json' },
    ],
    defaults: { method: 'GET' },
  });

  // Extract
  registerNodeSpec({
    type: STEP_TYPES.EXTRACT,
    version: 1,
    display: { label: 'trích xuất', iconClass: 'icon-extract', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'selector', label: 'bộ chọn', type: 'string', widget: 'selector' },
      {
        key: 'attr',
        label: 'thuộc tính',
        type: 'select',
        options: [
          { label: 'văn bản(text)', value: 'text' },
          { label: 'văn bản(textContent)', value: 'textContent' },
          { label: 'định nghĩathuộc tính', value: 'attr' },
        ] as any,
      },
      {
        key: 'js',
        label: 'định nghĩaJS',
        type: 'string',
        help: 'trangthực thitrả về',
      },
      { key: 'saveAs', label: 'lưubiến', type: 'string', required: true },
    ],
    defaults: { saveAs: '' },
  });

  // Screenshot
  registerNodeSpec({
    type: STEP_TYPES.SCREENSHOT,
    version: 1,
    display: { label: 'ảnh chụp màn hình', iconClass: 'icon-screenshot', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'selector', label: 'mục tiêubộ chọn', type: 'string' },
      {
        key: 'fullPage',
        label: 'ảnh chụp màn hình',
        type: 'boolean',
        default: false,
      },
      { key: 'saveAs', label: 'lưubiến', type: 'string' },
    ],
    defaults: { fullPage: false },
  });

  // TriggerEvent
  registerNodeSpec({
    type: STEP_TYPES.TRIGGER_EVENT,
    version: 1,
    display: { label: 'kích hoạtsự kiện', iconClass: 'icon-trigger', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'target', label: 'mục tiêu', type: 'json', widget: 'targetlocator' },
      { key: 'event', label: 'sự kiệnkiểu', type: 'string', required: true },
      { key: 'bubbles', label: '', type: 'boolean', default: true },
      { key: 'cancelable', label: 'hủy', type: 'boolean', default: false },
    ],
    defaults: { event: '' },
  });

  // SetAttribute
  registerNodeSpec({
    type: STEP_TYPES.SET_ATTRIBUTE,
    version: 1,
    display: { label: 'cài đặtthuộc tính', iconClass: 'icon-attr', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'target', label: 'mục tiêu', type: 'json', widget: 'targetlocator' },
      { key: 'name', label: 'thuộc tính', type: 'string', required: true },
      { key: 'value', label: 'thuộc tính', type: 'string' },
      { key: 'remove', label: 'gỡ bỏthuộc tính', type: 'boolean', default: false },
    ],
    defaults: { remove: false },
  });

  // LoopElements
  registerNodeSpec({
    type: STEP_TYPES.LOOP_ELEMENTS,
    version: 1,
    display: { label: 'vòng lặpphần tử', iconClass: 'icon-loop', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'selector', label: 'bộ chọn', type: 'string', required: true },
      {
        key: 'saveAs',
        label: 'danh sáchbiến',
        type: 'string',
        default: 'elements',
      },
      {
        key: 'itemVar',
        label: 'biến',
        type: 'string',
        default: 'item',
      },
      { key: 'subflowId', label: 'quy trình conID', type: 'string', required: true },
    ],
    defaults: { saveAs: 'elements', itemVar: 'item' },
  });

  // SwitchFrame
  registerNodeSpec({
    type: STEP_TYPES.SWITCH_FRAME,
    version: 1,
    display: { label: 'chuyển đổiFrame', iconClass: 'icon-frame', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'frame',
        label: 'frameđịnh vị',
        type: 'object',
        fields: [
          { key: 'index', label: 'chỉ mục', type: 'number' },
          { key: 'urlContains', label: 'URLbao gồm', type: 'string' },
        ],
      },
    ],
    defaults: {},
  });

  // HandleDownload
  registerNodeSpec({
    type: STEP_TYPES.HANDLE_DOWNLOAD,
    version: 1,
    display: { label: 'tải xuốngxử lý', iconClass: 'icon-download', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'filenameContains', label: 'tệpbao gồm', type: 'string' },
      { key: 'waitForComplete', label: 'chờhoàn tất', type: 'boolean', default: true },
      { key: 'timeoutMs', label: 'hết thời gian(ms)', type: 'number', default: 60000 },
      { key: 'saveAs', label: 'lưubiến', type: 'string' },
    ],
    defaults: { waitForComplete: true, timeoutMs: 60000 },
  });

  // Script
  registerNodeSpec({
    type: STEP_TYPES.SCRIPT,
    version: 1,
    display: { label: 'script', iconClass: 'icon-script', category: 'Tools' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'world',
        label: 'thực thingữ cảnh',
        type: 'select',
        options: [
          { label: 'ISOLATED', value: 'ISOLATED' },
          { label: 'MAIN', value: 'MAIN' },
        ] as any,
        default: 'ISOLATED',
      },
      {
        key: 'code',
        label: 'script',
        type: 'string',
        widget: 'code',
        required: true,
      },
      {
        key: 'when',
        label: 'thực thithời điểm',
        type: 'select',
        options: [
          { label: 'before', value: 'before' },
          { label: 'after', value: 'after' },
        ] as any,
        default: 'after',
      },
      { key: 'assign', label: 'ánh xạ(JSON)', type: 'json' },
      { key: 'saveAs', label: 'lưubiến', type: 'string' },
    ],
    defaults: { world: 'ISOLATED', when: 'after' },
  });

  // Tabs
  registerNodeSpec({
    type: STEP_TYPES.OPEN_TAB,
    version: 1,
    display: { label: 'nhãn', iconClass: 'icon-openTab', category: 'Tabs' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'url', label: 'URL', type: 'string' },
      { key: 'newWindow', label: '', type: 'boolean', default: false },
    ],
    defaults: { newWindow: false },
  });
  registerNodeSpec({
    type: 'executeFlow' as any,
    version: 1,
    display: { label: 'thực thiquy trình con', iconClass: 'icon-exec', category: 'Flow' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'flowId', label: 'quy trìnhID', type: 'string', required: true },
      { key: 'inline', label: 'thực thi', type: 'boolean', default: false },
      { key: 'args', label: 'tham số(JSON)', type: 'json' },
    ],
    defaults: { inline: false },
  });
  registerNodeSpec({
    type: STEP_TYPES.SWITCH_TAB,
    version: 1,
    display: { label: 'chuyển đổinhãn', iconClass: 'icon-switchTab', category: 'Tabs' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'tabId', label: 'TabId', type: 'number' },
      { key: 'urlContains', label: 'URLbao gồm', type: 'string' },
      { key: 'titleContains', label: 'tiêu đềbao gồm', type: 'string' },
    ],
    defaults: {},
  });
  registerNodeSpec({
    type: STEP_TYPES.CLOSE_TAB,
    version: 1,
    display: { label: 'đóngnhãn', iconClass: 'icon-closeTab', category: 'Tabs' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'tabIds',
        label: 'TabIds',
        type: 'array',
        item: { key: 'id', label: 'id', type: 'number' } as any,
      },
      { key: 'url', label: 'URL', type: 'string' },
    ],
    defaults: {},
  });

  // Logic
  registerNodeSpec({
    type: STEP_TYPES.IF,
    version: 1,
    display: { label: 'điều kiện', iconClass: 'icon-if', category: 'Logic' },
    ports: { inputs: 1, outputs: 'any' },
    schema: [
      {
        key: 'condition',
        label: 'điều kiệnbiểu thức(JSON)',
        type: 'json',
        help: ' {"expression":"vars.a>0"} ',
      },
      {
        key: 'branches',
        label: 'nhánh',
        type: 'array',
        item: {
          key: 'b',
          label: 'case',
          type: 'object',
          fields: [
            { key: 'id', label: 'ID', type: 'string' },
            { key: 'name', label: 'tên', type: 'string' },
            { key: 'expr', label: 'biểu thức', type: 'string' },
          ],
        } as any,
      },
      { key: 'else', label: 'bật else', type: 'boolean', default: true },
    ],
    defaults: { else: true },
  });
  registerNodeSpec({
    type: STEP_TYPES.FOREACH,
    version: 1,
    display: { label: 'vòng lặp', iconClass: 'icon-foreach', category: 'Logic' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'listVar', label: 'danh sáchbiến', type: 'string', required: true },
      { key: 'itemVar', label: 'biến', type: 'string', default: 'item' },
      { key: 'subflowId', label: 'quy trình conID', type: 'string', required: true },
      {
        key: 'concurrency',
        label: '',
        type: 'number',
        default: 1,
        help: 'thực thiquy trình con(biến, tự động)',
      },
    ],
    defaults: { itemVar: 'item' },
  });
  registerNodeSpec({
    type: STEP_TYPES.WHILE,
    version: 1,
    display: { label: 'vòng lặp', iconClass: 'icon-while', category: 'Logic' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'condition', label: 'điều kiện(JSON)', type: 'json' },
      { key: 'subflowId', label: 'quy trình conID', type: 'string', required: true },
      { key: 'maxIterations', label: 'tối đa', type: 'number', default: 100 },
    ],
    defaults: { maxIterations: 100 },
  });

  // Delay (UI-only helper)
  registerNodeSpec({
    type: STEP_TYPES.DELAY,
    version: 1,
    display: { label: 'độ trễ', iconClass: 'icon-delay', category: 'Actions' },
    ports: { inputs: 1, outputs: [{ label: 'default' }] },
    schema: [
      {
        key: 'sleep',
        label: 'độ trễ',
        type: 'number',
        widget: 'duration',
        required: true,
        default: 1000,
      },
    ],
    defaults: { sleep: 1000 },
  });

  // Trigger (builder-only, flow-level node)
  registerNodeSpec({
    type: STEP_TYPES.TRIGGER,
    version: 1,
    display: { label: 'trigger', iconClass: 'icon-trigger', category: 'Flow' },
    ports: { inputs: 0, outputs: [{ label: 'default' }] },
    schema: [
      { key: 'enabled', label: 'bật', type: 'boolean', default: true },
      { key: 'description', label: 'mô tả', type: 'string' },
      {
        key: 'modes',
        label: 'schema',
        type: 'object',
        fields: [
          { key: 'manual', label: 'thủ công', type: 'boolean', default: true },
          { key: 'url', label: 'URL kích hoạt', type: 'boolean', default: false },
          { key: 'contextMenu', label: 'menu chuột phải', type: 'boolean', default: false },
          { key: 'command', label: 'phím tắt', type: 'boolean', default: false },
          { key: 'dom', label: 'DOM sự kiện', type: 'boolean', default: false },
          { key: 'schedule', label: 'định thời', type: 'boolean', default: false },
        ],
      },
      {
        key: 'url',
        label: 'URL quy tắc',
        type: 'object',
        fields: [
          {
            key: 'rules',
            label: 'quy tắcdanh sách',
            type: 'array',
            item: {
              key: 'rule',
              label: 'quy tắc',
              type: 'object',
              fields: [
                {
                  key: 'kind',
                  label: 'kiểu',
                  type: 'select',
                  options: [
                    { label: 'URL', value: 'url' },
                    { label: 'tên miền', value: 'domain' },
                    { label: 'đường dẫn', value: 'path' },
                  ] as any,
                  default: 'url',
                },
                { key: 'value', label: '', type: 'string' },
              ],
            } as any,
          },
        ],
      },
      {
        key: 'contextMenu',
        label: 'menu chuột phải',
        type: 'object',
        fields: [
          { key: 'title', label: 'tiêu đề', type: 'string', default: 'chạyquy trình làm việc' },
          { key: 'enabled', label: 'bật', type: 'boolean', default: false },
        ],
      },
      {
        key: 'command',
        label: 'phím tắt',
        type: 'object',
        fields: [
          { key: 'commandKey', label: 'phím tắt', type: 'string' },
          { key: 'enabled', label: 'bật', type: 'boolean', default: false },
        ],
      },
      {
        key: 'dom',
        label: 'DOM sự kiện',
        type: 'object',
        fields: [
          { key: 'selector', label: 'bộ chọn', type: 'string' },
          { key: 'appear', label: '', type: 'boolean', default: true },
          { key: 'once', label: 'một lần', type: 'boolean', default: true },
          { key: 'debounceMs', label: '(ms)', type: 'number', default: 800 },
          { key: 'enabled', label: 'bật', type: 'boolean', default: false },
        ],
      },
      {
        key: 'schedules',
        label: 'định thời',
        type: 'array',
        item: {
          key: 'sched',
          label: '',
          type: 'object',
          fields: [
            { key: 'id', label: 'ID', type: 'string' },
            {
              key: 'type',
              label: 'kiểu',
              type: 'select',
              options: [
                { label: 'một lần', value: 'once' },
                { label: 'khoảng cách', value: 'interval' },
                { label: '', value: 'daily' },
              ] as any,
            },
            { key: 'when', label: 'thời gian(ISO/cron)', type: 'string' },
            { key: 'enabled', label: 'bật', type: 'boolean', default: true },
          ],
        } as any,
      },
    ],
    defaults: { enabled: true },
  });
}
