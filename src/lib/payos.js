export async function createPaymentLink(orderId, amount) {
  // TODO: Integration PayOS tạo link thanh toán
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentUrl: `https://pay.payos.vn/mock-link-${orderId}`,
        orderId: orderId,
        amount: amount
      });
    }, 500);
  });
}
