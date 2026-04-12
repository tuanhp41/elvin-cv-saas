/**
 * KỊCH BẢN PHỎNG VẤN AI (Luồng A)
 * Quản lý trạng thái và thứ tự các câu hỏi để trích xuất dữ liệu CV
 */

export const INTERVIEW_SCRIPT = [
  {
    step: 0,
    field_target: "personalInfo.fullName",
    ai_prompt: "Chào bạn, mình là Phù thuỷ CV AI. Tên đầy đủ của bạn là gì nhỉ? (Bạn cứ chat tự nhiên nhé!)",
    system_instruction: "Extract the full name from the user's response."
  },
  {
    step: 1,
    field_target: "personalInfo.contact",
    ai_prompt: "Chào {name}! Bạn có thể cho mình xin Email và Số điện thoại liên hệ được không?",
    system_instruction: "Extract email and phone number and any links like LinkedIn."
  },
  {
    step: 2,
    field_target: "objective",
    ai_prompt: "Bạn đang tìm kiếm vị trí công việc như thế nào, và mục tiêu nghề nghiệp của bạn là gì?",
    system_instruction: "Extract the career objective and desired position."
  },
  {
    step: 3,
    field_target: "experience",
    ai_prompt: "Tuyệt vời. Bây giờ hãy kể cho mình nghe về kinh nghiệm làm việc **gần đây nhất** của bạn nhé. (Ví dụ: Tên công ty, Vị trí, Thời gian làm việc, và những việc bạn đã làm).",
    system_instruction: "Extract work experience details (company, role, duration, achievements)."
  },
  {
    step: 4,
    field_target: "experience_more",
    ai_prompt: "Bạn làm rất tốt! Bạn có công việc/dự án nào trước đó muốn trình bày thêm không, hay mình chuyển sang phần học vấn nhé?",
    system_instruction: "Extract additional work experience, or note if the user wants to skip."
  },
  {
    step: 5,
    field_target: "education",
    ai_prompt: "Bạn đã tốt nghiệp trường nào, chuyên ngành gì, và xếp loại ra sao?",
    system_instruction: "Extract education details (school, major, period, grade)."
  },
  {
    step: 6,
    field_target: "skills",
    ai_prompt: "Bạn tự tin nhất ở những Kỹ năng chuyên môn hay Công cụ/Phần mềm nào?",
    system_instruction: "Extract a list of professional skills and tools."
  },
  {
    step: 7,
    field_target: "others",
    ai_prompt: "Sắp xong rồi! Bạn có muốn bổ sung thêm Chứng chỉ, Giải thưởng hay Sở thích cá nhân nào không?",
    system_instruction: "Extract certifications, awards, or hobbies."
  }
];

/**
 * Helper: Trả về câu hỏi tiếp theo dựa trên step hiện tại
 */
export function getNextQuestion(currentStep, userData = {}) {
  const nextStepInfo = INTERVIEW_SCRIPT.find(s => s.step === currentStep + 1);
  if (!nextStepInfo) return null; // Hoàn thành script

  // Replace placeholders if any (like {name})
  let prompt = nextStepInfo.ai_prompt;
  if (prompt.includes("{name}") && userData?.personalInfo?.fullName) {
    const firstName = userData.personalInfo.fullName.split(' ').pop();
    prompt = prompt.replace("{name}", firstName);
  }

  return {
    ...nextStepInfo,
    prompt
  };
}
