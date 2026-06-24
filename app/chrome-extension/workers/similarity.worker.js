/* eslint-disable */
// js/similarity.worker.js
importScripts('../libs/ort.min.js'); // noiDungTiengVietđường dẫnnoiDungTiengVietkhớpnoiDungTiengViettệpcấu trúc

// toàn cụcWorkertrạng thái
let session = null;
let modelPathInternal = null;
let ortEnvConfigured = false;
let sessionOptions = null;
let modelInputNames = null; // lưu trữmô hìnhnoiDungTiengVietđầu vàotên

// tái sử dụngnoiDungTiengViet TypedArray vùng đệm，giảm cấp phát bộ nhớ
let reusableBuffers = {
  inputIds: null,
  attentionMask: null,
  tokenTypeIds: null,
};

// noiDungTiengViet
let workerStats = {
  totalInferences: 0,
  totalInferenceTime: 0,
  averageInferenceTime: 0,
  memoryAllocations: 0,
};

// cấu hình ONNX Runtime noiDungTiengViet (noiDungTiengVietmột lần)
function configureOrtEnv(numThreads = 1, executionProviders = ['wasm']) {
  if (ortEnvConfigured) return;
  try {
    ort.env.wasm.numThreads = numThreads;
    ort.env.wasm.simd = true; // noiDungTiengVietbậtSIMD
    ort.env.wasm.proxy = false; // noiDungTiengVietWorkernoiDungTiengViet，noiDungTiengVietkhông cầnnoiDungTiengViet
    ort.env.logLevel = 'warning'; // 'verbose', 'info', 'warning', 'error', 'fatal'
    ortEnvConfigured = true;

    sessionOptions = {
      executionProviders: executionProviders,
      graphOptimizationLevel: 'all',
      enableCpuMemArena: true,
      enableMemPattern: true,
      // executionMode: 'sequential' // noiDungTiengVietworkerbên trongnoiDungTiengVietthứ tựthực thinoiDungTiengViet
    };
  } catch (error) {
    console.error('Worker: Failed to configure ORT environment', error);
    throw error; // noiDungTiengVietlỗi，noiDungTiengVietluồng chínhnoiDungTiengViet
  }
}

async function initializeModel(modelPathOrData, numThreads, executionProviders) {
  try {
    configureOrtEnv(numThreads, executionProviders); // đảm bảonoiDungTiengVietcấu hình

    if (!modelPathOrData) {
      throw new Error('Worker: Model path or data is not provided.');
    }

    // Check if input is ArrayBuffer (cached model data) or string (URL path)
    if (modelPathOrData instanceof ArrayBuffer) {
      console.log(
        `Worker: Initializing model from cached ArrayBuffer (${modelPathOrData.byteLength} bytes)`,
      );
      session = await ort.InferenceSession.create(modelPathOrData, sessionOptions);
      modelPathInternal = '[Cached ArrayBuffer]'; // For debugging purposes
    } else {
      console.log(`Worker: Initializing model from URL: ${modelPathOrData}`);
      modelPathInternal = modelPathOrData; // lưu trữmô hìnhđường dẫnnoiDungTiengVietgỡ lỗinoiDungTiengViet（nếucần）
      session = await ort.InferenceSession.create(modelPathInternal, sessionOptions);
    }

    // lấymô hìnhnoiDungTiengVietđầu vàotên，dùng chophán đoáncó/khôngcầntoken_type_ids
    modelInputNames = session.inputNames;
    console.log(`Worker: ONNX session created successfully for model: ${modelPathInternal}`);
    console.log(`Worker: Model input names:`, modelInputNames);

    return { status: 'success', message: 'Model initialized' };
  } catch (error) {
    console.error(`Worker: Model initialization failed:`, error);
    session = null; // dọn dẹpsessionnoiDungTiengVietkhởi tạo
    modelInputNames = null;
    // noiDungTiengVietlỗithông tintuần tự hóa，noiDungTiengVietErrorđối tượngnoiDungTiengVietkhông thểtrực tiếppostMessage
    throw new Error(`Worker: Model initialization failed - ${error.message}`);
  }
}

// tối ưu hóanoiDungTiengVietvùng đệmquản lýhàm
function getOrCreateBuffer(name, requiredLength, type = BigInt64Array) {
  if (!reusableBuffers[name] || reusableBuffers[name].length < requiredLength) {
    reusableBuffers[name] = new type(requiredLength);
    workerStats.memoryAllocations++;
  }
  return reusableBuffers[name];
}

// tối ưu hóanoiDungTiengVietxử lýsuy luậnhàm
async function runBatchInference(batchData) {
  if (!session) {
    throw new Error("Worker: Session not initialized. Call 'initializeModel' first.");
  }

  const startTime = performance.now();

  try {
    const feeds = {};
    const batchSize = batchData.dims.input_ids[0];
    const seqLength = batchData.dims.input_ids[1];

    // tối ưu hóa：tái sử dụngvùng đệm，giảm cấp phát bộ nhớ
    const inputIdsLength = batchData.input_ids.length;
    const attentionMaskLength = batchData.attention_mask.length;

    // tái sử dụngnoiDungTiengViettạo BigInt64Array vùng đệm
    const inputIdsBuffer = getOrCreateBuffer('inputIds', inputIdsLength);
    const attentionMaskBuffer = getOrCreateBuffer('attentionMask', attentionMaskLength);

    // hàng loạtđiềndữ liệu（tránh map thao tác）
    for (let i = 0; i < inputIdsLength; i++) {
      inputIdsBuffer[i] = BigInt(batchData.input_ids[i]);
    }
    for (let i = 0; i < attentionMaskLength; i++) {
      attentionMaskBuffer[i] = BigInt(batchData.attention_mask[i]);
    }

    feeds['input_ids'] = new ort.Tensor(
      'int64',
      inputIdsBuffer.slice(0, inputIdsLength),
      batchData.dims.input_ids,
    );
    feeds['attention_mask'] = new ort.Tensor(
      'int64',
      attentionMaskBuffer.slice(0, attentionMaskLength),
      batchData.dims.attention_mask,
    );

    // xử lý token_type_ids - noiDungTiengVietmô hìnhcầnnoiDungTiengViet
    if (modelInputNames && modelInputNames.includes('token_type_ids')) {
      if (batchData.token_type_ids && batchData.dims.token_type_ids) {
        const tokenTypeIdsLength = batchData.token_type_ids.length;
        const tokenTypeIdsBuffer = getOrCreateBuffer('tokenTypeIds', tokenTypeIdsLength);

        for (let i = 0; i < tokenTypeIdsLength; i++) {
          tokenTypeIdsBuffer[i] = BigInt(batchData.token_type_ids[i]);
        }

        feeds['token_type_ids'] = new ort.Tensor(
          'int64',
          tokenTypeIdsBuffer.slice(0, tokenTypeIdsLength),
          batchData.dims.token_type_ids,
        );
      } else {
        // tạomặc địnhnoiDungTiengViet token_type_ids
        const tokenTypeIdsBuffer = getOrCreateBuffer('tokenTypeIds', inputIdsLength);
        tokenTypeIdsBuffer.fill(0n, 0, inputIdsLength);

        feeds['token_type_ids'] = new ort.Tensor(
          'int64',
          tokenTypeIdsBuffer.slice(0, inputIdsLength),
          batchData.dims.input_ids,
        );
      }
    } else {
      console.log('Worker: Skipping token_type_ids as model does not require it');
    }

    // thực thinoiDungTiengVietxử lýsuy luận
    const results = await session.run(feeds);
    const outputTensor = results.last_hidden_state || results[Object.keys(results)[0]];

    // sử dụng Transferable Objects tối ưu hóadữ liệutruyền tải
    const outputData = new Float32Array(outputTensor.data);

    // cập nhậtthông tin thống kê
    workerStats.totalInferences += batchSize; // noiDungTiengVietxử lýtính toánnoiDungTiengVietsuy luận
    const inferenceTime = performance.now() - startTime;
    workerStats.totalInferenceTime += inferenceTime;
    workerStats.averageInferenceTime = workerStats.totalInferenceTime / workerStats.totalInferences;

    return {
      status: 'success',
      output: {
        data: outputData,
        dims: outputTensor.dims,
        batchSize: batchSize,
        seqLength: seqLength,
      },
      transferList: [outputData.buffer],
      stats: {
        inferenceTime,
        totalInferences: workerStats.totalInferences,
        averageInferenceTime: workerStats.averageInferenceTime,
        memoryAllocations: workerStats.memoryAllocations,
        batchSize: batchSize,
      },
    };
  } catch (error) {
    console.error('Worker: Batch inference failed:', error);
    throw new Error(`Worker: Batch inference failed - ${error.message}`);
  }
}

async function runInference(inputData) {
  if (!session) {
    throw new Error("Worker: Session not initialized. Call 'initializeModel' first.");
  }

  const startTime = performance.now();

  try {
    const feeds = {};

    // tối ưu hóa：tái sử dụngvùng đệm，giảm cấp phát bộ nhớ
    const inputIdsLength = inputData.input_ids.length;
    const attentionMaskLength = inputData.attention_mask.length;

    // tái sử dụngnoiDungTiengViettạo BigInt64Array vùng đệm
    const inputIdsBuffer = getOrCreateBuffer('inputIds', inputIdsLength);
    const attentionMaskBuffer = getOrCreateBuffer('attentionMask', attentionMaskLength);

    // điềndữ liệu（tránh map thao tác）
    for (let i = 0; i < inputIdsLength; i++) {
      inputIdsBuffer[i] = BigInt(inputData.input_ids[i]);
    }
    for (let i = 0; i < attentionMaskLength; i++) {
      attentionMaskBuffer[i] = BigInt(inputData.attention_mask[i]);
    }

    feeds['input_ids'] = new ort.Tensor(
      'int64',
      inputIdsBuffer.slice(0, inputIdsLength),
      inputData.dims.input_ids,
    );
    feeds['attention_mask'] = new ort.Tensor(
      'int64',
      attentionMaskBuffer.slice(0, attentionMaskLength),
      inputData.dims.attention_mask,
    );

    // xử lý token_type_ids - noiDungTiengVietmô hìnhcầnnoiDungTiengViet
    if (modelInputNames && modelInputNames.includes('token_type_ids')) {
      if (inputData.token_type_ids && inputData.dims.token_type_ids) {
        const tokenTypeIdsLength = inputData.token_type_ids.length;
        const tokenTypeIdsBuffer = getOrCreateBuffer('tokenTypeIds', tokenTypeIdsLength);

        for (let i = 0; i < tokenTypeIdsLength; i++) {
          tokenTypeIdsBuffer[i] = BigInt(inputData.token_type_ids[i]);
        }

        feeds['token_type_ids'] = new ort.Tensor(
          'int64',
          tokenTypeIdsBuffer.slice(0, tokenTypeIdsLength),
          inputData.dims.token_type_ids,
        );
      } else {
        // tạomặc địnhnoiDungTiengViet token_type_ids
        const tokenTypeIdsBuffer = getOrCreateBuffer('tokenTypeIds', inputIdsLength);
        tokenTypeIdsBuffer.fill(0n, 0, inputIdsLength);

        feeds['token_type_ids'] = new ort.Tensor(
          'int64',
          tokenTypeIdsBuffer.slice(0, inputIdsLength),
          inputData.dims.input_ids,
        );
      }
    } else {
      console.log('Worker: Skipping token_type_ids as model does not require it');
    }

    const results = await session.run(feeds);
    const outputTensor = results.last_hidden_state || results[Object.keys(results)[0]];

    // sử dụng Transferable Objects tối ưu hóadữ liệutruyền tải
    const outputData = new Float32Array(outputTensor.data);

    // cập nhậtthông tin thống kê
    workerStats.totalInferences++;
    const inferenceTime = performance.now() - startTime;
    workerStats.totalInferenceTime += inferenceTime;
    workerStats.averageInferenceTime = workerStats.totalInferenceTime / workerStats.totalInferences;

    return {
      status: 'success',
      output: {
        data: outputData, // trực tiếptrả về Float32Array
        dims: outputTensor.dims,
      },
      transferList: [outputData.buffer], // đánh dấu lànoiDungTiengVietđối tượng
      stats: {
        inferenceTime,
        totalInferences: workerStats.totalInferences,
        averageInferenceTime: workerStats.averageInferenceTime,
        memoryAllocations: workerStats.memoryAllocations,
      },
    };
  } catch (error) {
    console.error('Worker: Inference failed:', error);
    throw new Error(`Worker: Inference failed - ${error.message}`);
  }
}

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case 'init':
        // Support both modelPath (URL string) and modelData (ArrayBuffer)
        const modelInput = payload.modelData || payload.modelPath;
        await initializeModel(modelInput, payload.numThreads, payload.executionProviders);
        self.postMessage({ id, type: 'init_complete', status: 'success' });
        break;
      case 'infer':
        const result = await runInference(payload);
        // sử dụng Transferable Objects tối ưu hóadữ liệutruyền tải
        self.postMessage(
          {
            id,
            type: 'infer_complete',
            status: 'success',
            payload: result.output,
            stats: result.stats,
          },
          result.transferList || [],
        );
        break;
      case 'batchInfer':
        const batchResult = await runBatchInference(payload);
        // sử dụng Transferable Objects tối ưu hóadữ liệutruyền tải
        self.postMessage(
          {
            id,
            type: 'batchInfer_complete',
            status: 'success',
            payload: batchResult.output,
            stats: batchResult.stats,
          },
          batchResult.transferList || [],
        );
        break;
      case 'getStats':
        self.postMessage({
          id,
          type: 'stats_complete',
          status: 'success',
          payload: workerStats,
        });
        break;
      case 'clearBuffers':
        // dọn dẹpvùng đệm，noiDungTiengViet
        reusableBuffers = {
          inputIds: null,
          attentionMask: null,
          tokenTypeIds: null,
        };
        workerStats.memoryAllocations = 0;
        self.postMessage({
          id,
          type: 'clear_complete',
          status: 'success',
          payload: { message: 'Buffers cleared' },
        });
        break;
      default:
        console.warn(`Worker: Unknown message type: ${type}`);
        self.postMessage({
          id,
          type: 'error',
          status: 'error',
          payload: { message: `Unknown message type: ${type}` },
        });
    }
  } catch (error) {
    // đảm bảonoiDungTiengVietlỗinoiDungTiengVietđối tượnggửi，noiDungTiengVietErrorđối tượngnoiDungTiengVietkhông thểnoiDungTiengViettuần tự hóa
    self.postMessage({
      id,
      type: `${type}_error`, // noiDungTiengViet 'init_error' noiDungTiengViet 'infer_error'
      status: 'error',
      payload: {
        message: error.message,
        stack: error.stack, // tùy chọn，dùng chogỡ lỗi
        name: error.name,
      },
    });
  }
};
