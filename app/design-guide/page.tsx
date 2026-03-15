import {
  Button,
  ChatInput,
  InfoIconBadge,
  SelectField,
  TextField,
} from "@/components/ui";

type ColorToken = {
  name: string;
  className: string;
  hex: string;
};

const colorTokens: ReadonlyArray<ColorToken> = [
  { name: "KMU Blue", className: "bg-kmu-blue", hex: "#004F9F" },
  { name: "Background Blue", className: "bg-background-blue", hex: "#EFF6FF" },
  { name: "Text Primary", className: "bg-text-primary", hex: "#0A0A0A" },
  { name: "Text Secondary", className: "bg-text-secondary", hex: "#4A5565" },
  { name: "Text Muted", className: "bg-text-muted", hex: "#717182" },
  {
    name: "Input Background",
    className: "bg-input-background",
    hex: "#F3F3F5",
  },
  {
    name: "White",
    className: "bg-white border border-border-subtle",
    hex: "#FFFFFF",
  },
];

export default function DesignGuidePage() {
  return (
    <div className="min-h-screen bg-white px-6 py-8 text-text-primary md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="typo-heading-1">알파 프로젝트 디자인 가이드</h1>
          <p className="typo-paragraph text-text-secondary">
            색상, 타이포그래피, 공통 컴포넌트 적용 상태를 한 페이지에서 확인할 수
            있습니다.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="typo-heading-2">색상</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colorTokens.map((token) => (
              <div
                className="rounded-2xl border border-border-subtle bg-white p-3"
                key={token.name}
              >
                <div className={`h-20 w-full rounded-xl ${token.className}`} />
                <p className="mt-3 typo-small-text text-text-primary">{token.name}</p>
                <p className="text-xs text-text-muted">{token.hex}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border-subtle bg-white p-6">
          <h2 className="typo-heading-2">타이포그래피</h2>
          <div className="space-y-2">
            <p className="typo-heading-1">Heading 1 / 30-36 / Bold</p>
            <p className="typo-heading-2">Heading 2 / 24-32 / Bold</p>
            <p className="typo-heading-3">Heading 3 / 18-27 / Semi Bold</p>
            <p className="typo-paragraph text-text-secondary">
              Paragraph / 16-24 / Regular
            </p>
            <p className="typo-small-text text-text-muted">
              Small Text / 14-20 / Medium
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="typo-heading-2">컴포넌트</h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="typo-heading-3">Buttons</h3>
              <Button size="lg" variant="primary">
                Primary Large
              </Button>
              <Button size="md" variant="primary">
                Primary Medium
              </Button>
              <Button size="md" variant="secondary">
                Secondary
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button size="md" variant="secondary">
                  이전
                </Button>
                <Button size="md" variant="primary">
                  완료
                </Button>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="typo-heading-3">Inputs - Chat</h3>
              <ChatInput placeholder="질문을 입력하세요..." sendDisabled />
              <ChatInput defaultValue="학사 일정 알려줘" />
            </div>

            <div className="space-y-4 rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="typo-heading-3">Inputs - Text Field</h3>
              <TextField label="이름" placeholder="이름을 입력하세요" />
              <TextField label="학번" placeholder="학번을 입력하세요" />
              <SelectField
                label="사용자 구분"
                options={[
                  { label: "선택하세요", value: "" },
                  { label: "학생", value: "student" },
                  { label: "교수", value: "professor" },
                  { label: "직원", value: "staff" },
                ]}
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="typo-heading-3">Icons</h3>
              <div className="flex items-start gap-6">
                <InfoIconBadge icon={<span>💬</span>} label="대화형" />
                <InfoIconBadge icon={<span>📚</span>} label="출처" />
                <InfoIconBadge icon={<span>◎</span>} label="신뢰도" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
