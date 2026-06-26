#!/bin/bash
# Lấy thư mục tuyệt đối của script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="${SCRIPT_DIR}/dist/logs"

# Lấy timestamp hiện tại cho tên file log, tránh ghi đè
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
WRAPPER_LOG="${LOG_DIR}/native_host_wrapper_${TIMESTAMP}.log"

# Đường dẫn thực tế của script Node.js
NODE_SCRIPT="${SCRIPT_DIR}/index.js"

# Đảm bảo thư mục log tồn tại
mkdir -p "${LOG_DIR}"

# Ghi thông tin wrapper script được gọi
echo "Wrapper script called at $(date)" > "${WRAPPER_LOG}"
echo "SCRIPT_DIR: ${SCRIPT_DIR}" >> "${WRAPPER_LOG}"
echo "LOG_DIR: ${LOG_DIR}" >> "${WRAPPER_LOG}"
echo "NODE_SCRIPT: ${NODE_SCRIPT}" >> "${WRAPPER_LOG}"
echo "Initial PATH: ${PATH}" >> "${WRAPPER_LOG}"

# Tìm executable Node.js động
NODE_EXEC=""
# 1. Thử dùng which (sử dụng PATH hiện tại, nhưng PATH của Chrome có thể không đầy đủ)
if command -v node &>/dev/null; then
    NODE_EXEC=$(command -v node)
    echo "Found node using 'command -v node': ${NODE_EXEC}" >> "${WRAPPER_LOG}"
fi

# 2. Nếu which không tìm thấy, thử các đường dẫn Node.js phổ biến trên macOS
if [ -z "${NODE_EXEC}" ]; then
    COMMON_NODE_PATHS=(
        "/usr/local/bin/node"            # Homebrew trên Intel Mac / cài trực tiếp
        "/opt/homebrew/bin/node"         # Homebrew trên Apple Silicon
        "$HOME/.nvm/versions/node/$(ls -t $HOME/.nvm/versions/node | head -n 1)/bin/node" # NVM (phiên bản mới nhất)
        # Có thể thêm các đường dẫn khác tùy môi trường
    )
    for path_to_node in "${COMMON_NODE_PATHS[@]}"; do
        if [ -x "${path_to_node}" ]; then
            NODE_EXEC="${path_to_node}"
            echo "Found node at common path: ${NODE_EXEC}" >> "${WRAPPER_LOG}"
            break
        fi
    done
fi

# 3. Nếu vẫn không tìm thấy, ghi lỗi và thoát
if [ -z "${NODE_EXEC}" ]; then
    echo "ERROR: Node.js executable not found!" >> "${WRAPPER_LOG}"
    echo "Please ensure Node.js is installed and its path is accessible or configured in this script." >> "${WRAPPER_LOG}"
    # Đối với Native Host, cần giữ chạy để nhận message, nhưng nếu không tìm thấy node
    # thì cũng không thể thực thi script mục tiêu
    # Có thể output message lỗi theo giao thức Native Messaging cho extension (nếu được)
    # Hoặc để nó fail, Chrome sẽ báo Native Host Exited.
    exit 1 # Bắt buộc thoát, nếu không exec bên dưới sẽ fail
fi

echo "Using Node executable: ${NODE_EXEC}" >> "${WRAPPER_LOG}"
echo "Node version found by script: $(${NODE_EXEC} -v)" >> "${WRAPPER_LOG}"
echo "Executing: ${NODE_EXEC} ${NODE_SCRIPT}" >> "${WRAPPER_LOG}"
echo "PWD: $(pwd)" >> "${WRAPPER_LOG}" # Ghi PWD, đôi khi hữu ích

exec "${NODE_EXEC}" "${NODE_SCRIPT}" 2>> "${LOG_DIR}/native_host_stderr_${TIMESTAMP}.log"