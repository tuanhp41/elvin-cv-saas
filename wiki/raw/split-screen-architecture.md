# Wiki: Architecture + Data Flow (Day 4-6 Update)
# Cập nhật: 2026-04-12 Session #15
# Đây là raw wiki — sẽ được compile vào wiki/compiled/knowledge.md

## Split-Screen Architecture (D011)

### Tổng quan luồng dữ liệu
```
pages/create.jsx (state owner)
    ├── <ChatPanel onExtractData={handleExtractData} />
    │       └── user trả lời → gọi onExtractData(fieldTarget, value)
    │
    └── <CVPreview previewData={cvData} />
            └── nhận cvData → render qua TemplateComponent
```

### cvData structure
```javascript
{
  personalInfo: {
    fullName: "",     // câu 0 → personalInfo.fullName
    contact: ""       // câu 1 → personalInfo.contact
  },
  objective: "",      // câu 2 → objective
  experience: "",     // câu 3 → experience
  experience_more: "",// câu 4 → experience_more
  education: "",      // câu 5 → education
  skills: "",         // câu 6 → skills
  others: ""          // câu 7 → others
}
```

### updateExtractData pattern
```javascript
// Trong create.jsx
const handleExtractData = (fieldTarget, value) => {
  // fieldTarget = "personalInfo.fullName" → nested
  // fieldTarget = "objective" → flat
  setCvData(prev => {
    const parts = fieldTarget.split('.');
    if (parts.length === 2) {
      return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } };
    }
    return { ...prev, [fieldTarget]: value };
  });
};
```

## Template System

### Templates location
```
src/components/cv-templates/
  ProfessionalTemplate.jsx  — 2 cột, navy sidebar, corporate
  ModernTemplate.jsx        — 1 cột, gradient violet-blue, creative
  MinimalTemplate.jsx       — 1 cột, đen trắng, ATS-optimized
```

### Template interface (tất cả templates đều nhận cùng props)
```javascript
// Props chuẩn cho mọi template
export default function AnyTemplate({ data = {}, className }) {
  const { personalInfo, objective, experience, education, skills, others } = data;
  // render theo layout riêng của template
}
```

### TemplatePicker
- Component: `src/components/features/TemplatePicker.jsx`
- Props: `{ selectedTemplate, onSelect }`
- IDs: `'professional' | 'modern' | 'minimal'`
- CVPreview dùng dictionary để map ID → component:
```javascript
const TemplateComponent = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
}[selectedTemplate];
```

## Database Schema (Supabase)

### Migration file
`docs/supabase/migrations/001_cv_chat_schema.sql`

### Tables
```sql
cvs:
  id UUID PK, user_id UUID FK auth.users,
  title TEXT, template_id TEXT, language TEXT,
  data_json JSONB, score INTEGER,
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ

chat_sessions:
  id UUID PK, user_id UUID FK auth.users,
  cv_id UUID FK cvs (nullable),
  messages_json JSONB, status TEXT ('active'|'completed'|'abandoned'),
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
```

### CRUD Helpers
- `src/lib/db/cv.js` → createCV, getCV, updateCV, listCVs, deleteCV
- `src/lib/db/chat.js` → initSession, getSession, updateSessionMessages, updateSessionStatus
- Tất cả trả về `{ success: boolean, data: any, error: string }`

## Interview Script (AI mock)

### File: `src/lib/ai/interview-script.js`
- Export: `INTERVIEW_SCRIPT` (array 8 bước)
- Export: `getNextQuestion(currentStep, userData)` → trả về step info tiếp theo
- Mỗi step có: `step`, `field_target`, `ai_prompt`, `system_instruction`
- `system_instruction` dùng khi kết nối AI thật (Day 7)

## ChatPanel — Trạng thái hiện tại (Phiên #15)
- **Mock mode**: setTimeout 1.5s, không có AI thật
- Khi user gửi tin → copy nguyên text vào cvData field tương ứng
- Day 7 sẽ thay setTimeout bằng `fetch('/api/ai/interview')`
- API route `/api/ai/interview` sẽ dùng LLM để extract JSON từ câu trả lời tự nhiên
