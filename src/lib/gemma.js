export async function rewriteCV(cvData, language) {
  // TODO: Integration với Gemma 4 API (Google AI Studio)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: "Đây là CV mẫu đã được viết lại bởi Gemma 4 API.",
        language: language
      });
    }, 1000);
  });
}
