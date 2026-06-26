use wasm_bindgen::prelude::*;
use wide::f32x4;

// Thiết lập panic hook để debug trong trình duyệt
#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub struct SIMDMath;

#[wasm_bindgen]
impl SIMDMath {
    #[wasm_bindgen(constructor)]
    pub fn new() -> SIMDMath {
        SIMDMath
    }

    // Hàm trợ giúp: chỉ tính dot product (SIMD)
    #[inline]
    fn dot_product_simd_only(&self, vec_a: &[f32], vec_b: &[f32]) -> f32 {
        let len = vec_a.len();
        let simd_lanes = 4;
        let simd_len = len - (len % simd_lanes);
        let mut dot_sum_simd = f32x4::ZERO;

        for i in (0..simd_len).step_by(simd_lanes) {
            // Sử dụng try_from và new method, đây là API đúng của thư viện wide
            let a_array: [f32; 4] = vec_a[i..i + simd_lanes].try_into().unwrap();
            let b_array: [f32; 4] = vec_b[i..i + simd_lanes].try_into().unwrap();
            let a_chunk = f32x4::new(a_array);
            let b_chunk = f32x4::new(b_array);
            dot_sum_simd = a_chunk.mul_add(b_chunk, dot_sum_simd);
        }

        let mut dot_product = dot_sum_simd.reduce_add();
        for i in simd_len..len {
            dot_product += vec_a[i] * vec_b[i];
        }
        dot_product
    }

    #[wasm_bindgen]
    pub fn cosine_similarity(&self, vec_a: &[f32], vec_b: &[f32]) -> f32 {
        if vec_a.len() != vec_b.len() || vec_a.is_empty() {
            return 0.0;
        }

        let len = vec_a.len();
        let simd_lanes = 4;
        let simd_len = len - (len % simd_lanes);

        let mut dot_sum_simd = f32x4::ZERO;
        let mut norm_a_sum_simd = f32x4::ZERO;
        let mut norm_b_sum_simd = f32x4::ZERO;

        // Xử lý SIMD
        for i in (0..simd_len).step_by(simd_lanes) {
            let a_array: [f32; 4] = vec_a[i..i + simd_lanes].try_into().unwrap();
            let b_array: [f32; 4] = vec_b[i..i + simd_lanes].try_into().unwrap();
            let a_chunk = f32x4::new(a_array);
            let b_chunk = f32x4::new(b_array);

            // Sử dụng Fused Multiply-Add (FMA)
            dot_sum_simd = a_chunk.mul_add(b_chunk, dot_sum_simd);
            norm_a_sum_simd = a_chunk.mul_add(a_chunk, norm_a_sum_simd);
            norm_b_sum_simd = b_chunk.mul_add(b_chunk, norm_b_sum_simd);
        }

        // Tổng horizontal
        let mut dot_product = dot_sum_simd.reduce_add();
        let mut norm_a_sq = norm_a_sum_simd.reduce_add();
        let mut norm_b_sq = norm_b_sum_simd.reduce_add();

        // Xử lý phần tử còn lại
        for i in simd_len..len {
            dot_product += vec_a[i] * vec_b[i];
            norm_a_sq += vec_a[i] * vec_a[i];
            norm_b_sq += vec_b[i] * vec_b[i];
        }

        // Xử lý ổn định số đã tối ưu
        let norm_a = norm_a_sq.sqrt();
        let norm_b = norm_b_sq.sqrt();

        if norm_a == 0.0 || norm_b == 0.0 {
            return 0.0;
        }

        let magnitude = norm_a * norm_b;
        // Giới hạn kết quả trong [-1.0, 1.0], xử lý sai số dấu phẩy động
        (dot_product / magnitude).max(-1.0).min(1.0)
    }

    #[wasm_bindgen]
    pub fn batch_similarity(&self, vectors: &[f32], query: &[f32], vector_dim: usize) -> Vec<f32> {
        if vector_dim == 0 { return Vec::new(); }
        if vectors.len() % vector_dim != 0 { return Vec::new(); }
        if query.len() != vector_dim { return Vec::new(); }

        let num_vectors = vectors.len() / vector_dim;
        let mut results = Vec::with_capacity(num_vectors);

        // Tính trước norm của query vector
        let query_norm_sq = self.compute_norm_squared_simd(query);
        if query_norm_sq == 0.0 {
            return vec![0.0; num_vectors];
        }
        let query_norm = query_norm_sq.sqrt();

        for i in 0..num_vectors {
            let start = i * vector_dim;
            let vector_slice = &vectors[start..start + vector_dim];

            // dot_product_and_norm_simd tính norm của vector_slice (vec_a)
            let (dot_product, vector_norm_sq) = self.dot_product_and_norm_simd(vector_slice, query);

            if vector_norm_sq == 0.0 {
                results.push(0.0);
            } else {
                let vector_norm = vector_norm_sq.sqrt();
                let similarity = dot_product / (vector_norm * query_norm);
                results.push(similarity.max(-1.0).min(1.0));
            }
        }
        results
    }

    // Hàm trợ giúp: tính norm bình phương bằng SIMD
    #[inline]
    fn compute_norm_squared_simd(&self, vec: &[f32]) -> f32 {
        let len = vec.len();
        let simd_lanes = 4;
        let simd_len = len - (len % simd_lanes);
        let mut norm_sum_simd = f32x4::ZERO;

        for i in (0..simd_len).step_by(simd_lanes) {
            let array: [f32; 4] = vec[i..i + simd_lanes].try_into().unwrap();
            let chunk = f32x4::new(array);
            norm_sum_simd = chunk.mul_add(chunk, norm_sum_simd);
        }

        let mut norm_sq = norm_sum_simd.reduce_add();
        for i in simd_len..len {
            norm_sq += vec[i] * vec[i];
        }
        norm_sq
    }

    // Hàm trợ giúp: tính đồng thời dot product và norm bình phương của vec_a
    #[inline]
    fn dot_product_and_norm_simd(&self, vec_a: &[f32], vec_b: &[f32]) -> (f32, f32) {
        let len = vec_a.len(); // Giả sử vec_a.len() == vec_b.len()
        let simd_lanes = 4;
        let simd_len = len - (len % simd_lanes);

        let mut dot_sum_simd = f32x4::ZERO;
        let mut norm_a_sum_simd = f32x4::ZERO;

        for i in (0..simd_len).step_by(simd_lanes) {
            let a_array: [f32; 4] = vec_a[i..i + simd_lanes].try_into().unwrap();
            let b_array: [f32; 4] = vec_b[i..i + simd_lanes].try_into().unwrap();
            let a_chunk = f32x4::new(a_array);
            let b_chunk = f32x4::new(b_array);

            dot_sum_simd = a_chunk.mul_add(b_chunk, dot_sum_simd);
            norm_a_sum_simd = a_chunk.mul_add(a_chunk, norm_a_sum_simd);
        }

        let mut dot_product = dot_sum_simd.reduce_add();
        let mut norm_a_sq = norm_a_sum_simd.reduce_add();

        for i in simd_len..len {
            dot_product += vec_a[i] * vec_b[i];
            norm_a_sq += vec_a[i] * vec_a[i];
        }
        (dot_product, norm_a_sq)
    }

    // Tính ma trận tương đồng hàng loạt - phiên bản tối ưu
    #[wasm_bindgen]
    pub fn similarity_matrix(&self, vectors_a: &[f32], vectors_b: &[f32], vector_dim: usize) -> Vec<f32> {
        if vector_dim == 0 || vectors_a.len() % vector_dim != 0 || vectors_b.len() % vector_dim != 0 {
            return Vec::new();
        }

        let num_a = vectors_a.len() / vector_dim;
        let num_b = vectors_b.len() / vector_dim;
        let mut results = Vec::with_capacity(num_a * num_b);

        // 1. Tính trước norm của vectors_a
        let norms_a: Vec<f32> = (0..num_a)
            .map(|i| {
                let start = i * vector_dim;
                let vec_a_slice = &vectors_a[start..start + vector_dim];
                self.compute_norm_squared_simd(vec_a_slice).sqrt()
            })
            .collect();

        // 2. Tính trước norm của vectors_b
        let norms_b: Vec<f32> = (0..num_b)
            .map(|j| {
                let start = j * vector_dim;
                let vec_b_slice = &vectors_b[start..start + vector_dim];
                self.compute_norm_squared_simd(vec_b_slice).sqrt()
            })
            .collect();

        for i in 0..num_a {
            let start_a = i * vector_dim;
            let vec_a = &vectors_a[start_a..start_a + vector_dim];
            let norm_a = norms_a[i];

            if norm_a == 0.0 {
                // Nếu norm_a bằng 0, tất cả similarity đều là 0
                for _ in 0..num_b {
                    results.push(0.0);
                }
                continue;
            }

            for j in 0..num_b {
                let start_b = j * vector_dim;
                let vec_b = &vectors_b[start_b..start_b + vector_dim];
                let norm_b = norms_b[j];

                if norm_b == 0.0 {
                    results.push(0.0);
                    continue;
                }

                // Sử dụng hàm dot product chuyên dụng
                let dot_product = self.dot_product_simd_only(vec_a, vec_b);
                let magnitude = norm_a * norm_b;

                // magnitude không nên bằng 0 vì đã kiểm tra norm_a/norm_b
                let similarity = (dot_product / magnitude).max(-1.0).min(1.0);
                results.push(similarity);
            }
        }

        results
    }
}
