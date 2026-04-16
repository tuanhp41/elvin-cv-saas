import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8 max-w-lg text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đã có lỗi không mong muốn</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Xin lỗi bạn vì sự gián đoạn này. Phù thuỷ CV AI đang tạm nghỉ một chút, vui lòng tải lại trang để tiếp tục nhé.
            </p>
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl text-left mb-6 font-mono overflow-auto max-h-32 border border-red-100">
              {this.state.error?.message || "Unknown error"}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
