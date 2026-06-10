import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowRight,
  Archive,
  Check,
  Film,
  FolderOpen,
  LayoutTemplate,
  LogIn,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Video,
  Wand2,
} from "lucide-react";
import { Scene, VideoProject } from "./types";

type View =
  | "landing"
  | "signup"
  | "login"
  | "dashboard"
  | "new-project"
  | "workspace"
  | "templates"
  | "archive"
  | "pricing";

type User = {
  name: string;
};

type ProjectDraft = {
  title: string;
  goals: string;
  target: string;
  duration: string;
  style: string;
  idea: string;
};

type TemplateProject = {
  title: string;
  goals: string;
  target: string;
  duration: string;
  style: string;
  idea: string;
};

const emptyDraft: ProjectDraft = {
  title: "",
  goals: "",
  target: "",
  duration: "",
  style: "",
  idea: "",
};

const templates: TemplateProject[] = [
  {
    title: "브랜드 소개 영상",
    goals: "브랜드의 핵심 가치와 첫인상을 명확하게 전달",
    target: "신규 고객",
    duration: "1분 30초",
    style: "깔끔한 프리미엄 SaaS 톤",
    idea: "서비스가 해결하는 문제와 사용자가 얻게 되는 변화를 짧은 장면으로 구성",
  },
  {
    title: "캠퍼스 프로젝트 발표",
    goals: "과제 주제와 결과물을 설득력 있게 소개",
    target: "교수자와 수강생",
    duration: "2분",
    style: "차분한 발표형 다큐멘터리",
    idea: "문제 정의, 제작 과정, 결과 화면, 배운 점을 순서대로 정리",
  },
  {
    title: "제품 사용법 영상",
    goals: "시청자가 바로 따라 할 수 있는 사용 흐름 제시",
    target: "처음 사용하는 사용자",
    duration: "1분",
    style: "실용적인 튜토리얼",
    idea: "시작 화면부터 핵심 기능 사용까지 한 번의 흐름으로 촬영",
  },
];

const initialScenes: Scene[] = [
  {
    id: 1,
    title: "오프닝",
    description: "문제 상황과 영상의 주제를 짧고 선명하게 보여준다.",
    duration: "0:15",
    purpose: "시청자가 영상의 방향을 즉시 이해하게 만든다.",
    framing: "와이드 샷에서 인물 또는 핵심 오브젝트를 중앙에 둔다.",
    guide: "밝은 자연광 아래에서 안정적인 고정 구도로 촬영한다.",
    script: "지금부터 아이디어가 실제 영상 기획으로 바뀌는 과정을 보여드립니다.",
    moodImage: "",
    moodImagePrompt: "",
  },
  {
    id: 2,
    title: "핵심 전개",
    description: "아이디어, 기능, 장면의 중심 내용을 구체적인 행동으로 보여준다.",
    duration: "0:40",
    purpose: "영상의 핵심 메시지를 장면 단위로 설득한다.",
    framing: "미디엄 샷과 클로즈업을 번갈아 사용한다.",
    guide: "피사체의 손동작, 화면 변화, 표정을 끊어 찍어 편집 여지를 남긴다.",
    script: "핵심은 복잡한 생각을 촬영 가능한 장면으로 나누는 것입니다.",
    moodImage: "",
    moodImagePrompt: "",
  },
  {
    id: 3,
    title: "마무리",
    description: "결과와 다음 행동을 정리하며 영상을 완성한다.",
    duration: "0:20",
    purpose: "시청자가 메시지를 기억하고 다음 행동을 떠올리게 한다.",
    framing: "정돈된 정면 구도 또는 천천히 멀어지는 와이드 샷을 사용한다.",
    guide: "배경을 단순하게 유지하고 마지막 문장이 또렷하게 들리게 한다.",
    script: "좋은 영상은 멋진 아이디어보다 촬영 가능한 구조에서 시작됩니다.",
    moodImage: "",
    moodImagePrompt: "",
  },
];

function createProjectFromDraft(draft: ProjectDraft): VideoProject {
  const now = new Date().toISOString().slice(0, 10);

  return {
    id: `project-${Date.now()}`,
    title: draft.title.trim() || "새 영상 기획",
    goals: draft.goals.trim() || "영상의 핵심 메시지를 구조화합니다.",
    target: draft.target.trim() || "일반 시청자",
    duration: draft.duration.trim() || "2분",
    style: draft.style.trim() || "담백하고 명확한 톤",
    idea: draft.idea.trim() || "아이디어를 장면 단위로 정리합니다.",
    scenes: initialScenes.map((scene) => ({ ...scene })),
    lastEdited: now,
    thumbnail: "",
  };
}

function createProjectFromTemplate(template: TemplateProject): VideoProject {
  return createProjectFromDraft(template);
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [signupName, setSignupName] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPw, setSignupPw] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [focusedSceneId, setFocusedSceneId] = useState<number>(1);
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  );

  const focusedScene = useMemo(
    () => activeProject?.scenes.find((scene) => scene.id === focusedSceneId) ?? null,
    [activeProject, focusedSceneId],
  );

  const archivedProjects: VideoProject[] = [];

  const goDashboard = () => setView("dashboard");

  const navItems: Array<{ label: string; target: View }> = [
    { label: "Templates", target: "templates" },
    { label: "Archive", target: "archive" },
    { label: "Pricing", target: "pricing" },
  ];

  const handleSignup = (event: FormEvent) => {
    event.preventDefault();
    const name = signupName.trim();

    if (!name || !signupId.trim() || !signupPw.trim()) {
      return;
    }

    setUser({ name });
    setView("dashboard");
  };

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();

    if (!loginId.trim() || !loginPw.trim()) {
      return;
    }

    setUser((current) => current ?? { name: loginId.trim() });
    setView("dashboard");
  };

  const handleCreateProject = (event: FormEvent) => {
    event.preventDefault();
    const project = createProjectFromDraft(draft);

    setProjects((current) => [project, ...current]);
    setActiveProjectId(project.id);
    setFocusedSceneId(project.scenes[0]?.id ?? 1);
    setDraft(emptyDraft);
    setView("workspace");
  };

  const handleUseTemplate = (template: TemplateProject) => {
    const project = createProjectFromTemplate(template);

    setProjects((current) => [project, ...current]);
    setActiveProjectId(project.id);
    setFocusedSceneId(project.scenes[0]?.id ?? 1);
    setView("workspace");
  };

  const updateActiveProject = (updater: (project: VideoProject) => VideoProject) => {
    if (!activeProject) {
      return;
    }

    setProjects((current) =>
      current.map((project) => (project.id === activeProject.id ? updater(project) : project)),
    );
  };

  const updateScene = (sceneId: number, patch: Partial<Scene>) => {
    updateActiveProject((project) => ({
      ...project,
      lastEdited: new Date().toISOString().slice(0, 10),
      scenes: project.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, ...patch } : scene,
      ),
    }));
  };

  const addScene = () => {
    if (!activeProject) {
      return;
    }

    const nextId = Math.max(0, ...activeProject.scenes.map((scene) => scene.id)) + 1;
    const newScene: Scene = {
      id: nextId,
      title: `새 씬 ${nextId}`,
      description: "새 장면의 시각 정보를 입력하세요.",
      duration: "0:15",
      purpose: "장면의 목적",
      framing: "카메라 구도",
      guide: "촬영 가이드",
      script: "내레이션 또는 대사를 입력하세요.",
      moodImage: "",
      moodImagePrompt: "",
    };

    updateActiveProject((project) => ({
      ...project,
      scenes: [...project.scenes, newScene],
      lastEdited: new Date().toISOString().slice(0, 10),
    }));
    setFocusedSceneId(nextId);
    setImageError(null);
  };

  const deleteScene = (sceneId: number) => {
    if (!activeProject || activeProject.scenes.length <= 1) {
      return;
    }

    const remainingScenes = activeProject.scenes.filter((scene) => scene.id !== sceneId);

    updateActiveProject((project) => ({
      ...project,
      scenes: remainingScenes,
      lastEdited: new Date().toISOString().slice(0, 10),
    }));

    if (focusedSceneId === sceneId) {
      setFocusedSceneId(remainingScenes[0].id);
    }
  };

  const handleGenerateReferenceImage = async () => {
    if (!focusedScene) {
      return;
    }

    const prompt = (focusedScene.moodImagePrompt ?? "").trim();

    if (!prompt) {
      setImageError("생성 설명을 입력해주세요.");
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const response = await fetch("/api/generate-ref-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "AI 이미지 생성에 실패했습니다.");
      }

      if (!data.imageUrl || !String(data.imageUrl).startsWith("data:image/")) {
        throw new Error("이미지 데이터가 반환되지 않았습니다.");
      }

      updateScene(focusedScene.id, {
        moodImage: data.imageUrl,
        moodImagePromptUsed: prompt,
        translatedEnglishPrompt: data.translatedPrompt,
        promptUsedForImage: data.promptUsed,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI 이미지 생성에 실패했습니다.";
      setImageError(message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const openProject = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return;
    }

    setActiveProjectId(project.id);
    setFocusedSceneId(project.scenes[0]?.id ?? 1);
    setImageError(null);
    setView("workspace");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#FFFFFF]">
      <header className="sticky top-0 z-30 border-b border-[#FFFFFF]/20 bg-[#111111]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => setView("landing")}
            className="flex items-center gap-2 text-left text-[#FFFFFF]"
          >
            <Video className="h-6 w-6 text-[#60A5FA]" />
            <span className="text-lg font-bold tracking-wide">MONT</span>
          </button>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navItems.map((item) => (
              <button
                key={item.target}
                type="button"
                onClick={() => setView(item.target)}
                className="text-[#FFFFFF]/80 transition hover:text-[#60A5FA]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={goDashboard}
                className="rounded-md border border-[#60A5FA] px-4 py-2 text-sm font-semibold text-[#60A5FA] transition hover:bg-[#60A5FA] hover:text-[#111111]"
              >
                Workspace
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="hidden rounded-md border border-[#FFFFFF]/30 px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition hover:border-[#60A5FA] hover:text-[#60A5FA] sm:inline-flex"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setView("signup")}
                  className="inline-flex items-center gap-2 rounded-md bg-[#60A5FA] px-4 py-2 text-sm font-bold text-[#111111] transition hover:bg-[#FFFFFF]"
                >
                  <ArrowRight className="h-4 w-4" />
                  Start
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {view === "landing" && (
        <main>
          <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#60A5FA]">
              AI Video Planning MVP
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#FFFFFF] md:text-6xl">
              아이디어를 촬영 가능한 영상 기획으로
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#FFFFFF]/80 md:text-lg">
              영상 기획을 쉽고 빠르게 구조화하여 제작을 바로 시작할 수 있게 합니다.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setView("signup")}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#60A5FA] px-6 py-3 text-sm font-extrabold text-[#111111] transition hover:bg-[#FFFFFF]"
              >
                <Sparkles className="h-4 w-4" />
                무료 시작하기
              </button>
              <button
                type="button"
                onClick={() => setView("templates")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#FFFFFF]/30 px-6 py-3 text-sm font-bold text-[#FFFFFF] transition hover:border-[#60A5FA] hover:text-[#60A5FA]"
              >
                <Film className="h-4 w-4" />
                데모 보기
              </button>
            </div>
          </section>

          <section className="border-t border-[#FFFFFF]/20 px-6 py-14">
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
              {["장면 구조화", "촬영 레퍼런스", "과제용 MVP"].map((label) => (
                <div key={label} className="rounded-md border border-[#FFFFFF]/20 p-6">
                  <Check className="mb-4 h-5 w-5 text-[#60A5FA]" />
                  <h2 className="text-lg font-bold">{label}</h2>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {view === "signup" && (
        <AuthShell
          title="회원가입"
          subtitle="이름을 저장하고 Workspace로 이동합니다."
          footerText="이미 계정이 있나요?"
          footerAction="로그인"
          onFooterClick={() => setView("login")}
        >
          <form onSubmit={handleSignup} className="space-y-4">
            <Field label="이름" value={signupName} onChange={setSignupName} autoComplete="name" />
            <Field label="아이디" value={signupId} onChange={setSignupId} autoComplete="username" />
            <Field label="비밀번호" value={signupPw} onChange={setSignupPw} type="password" autoComplete="new-password" />
            <PrimaryButton label="가입하고 시작하기" icon={<ArrowRight className="h-4 w-4" />} />
          </form>
        </AuthShell>
      )}

      {view === "login" && (
        <AuthShell
          title="로그인"
          subtitle="Mock 로그인으로 바로 Workspace에 진입합니다."
          footerText="처음 사용하시나요?"
          footerAction="회원가입"
          onFooterClick={() => setView("signup")}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="아이디" value={loginId} onChange={setLoginId} autoComplete="username" />
            <Field label="비밀번호" value={loginPw} onChange={setLoginPw} type="password" autoComplete="current-password" />
            <PrimaryButton label="로그인" icon={<LogIn className="h-4 w-4" />} />
          </form>
        </AuthShell>
      )}

      {view === "dashboard" && (
        <PageShell title={`${user?.name ?? "사용자"}님의 Workspace`} actionLabel="새 프로젝트" onAction={() => setView("new-project")}>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardButton icon={<Plus className="h-5 w-5" />} label="New Project" onClick={() => setView("new-project")} />
            <DashboardButton icon={<LayoutTemplate className="h-5 w-5" />} label="Templates" onClick={() => setView("templates")} />
            <DashboardButton icon={<Archive className="h-5 w-5" />} label="Archive" onClick={() => setView("archive")} />
          </div>

          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold">Projects</h2>
            {projects.length === 0 ? (
              <EmptyState title="아직 프로젝트가 없습니다." action="새 프로젝트 만들기" onClick={() => setView("new-project")} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => openProject(project.id)}
                    className="rounded-md border border-[#FFFFFF]/20 p-5 text-left transition hover:border-[#60A5FA]"
                  >
                    <p className="text-sm text-[#60A5FA]">{project.lastEdited}</p>
                    <h3 className="mt-2 text-xl font-bold">{project.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#FFFFFF]/70">{project.idea}</p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </PageShell>
      )}

      {view === "new-project" && (
        <PageShell title="New Project">
          <form onSubmit={handleCreateProject} className="grid gap-4 lg:grid-cols-2">
            <Field label="프로젝트 제목" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
            <Field label="목표" value={draft.goals} onChange={(value) => setDraft({ ...draft, goals: value })} />
            <Field label="타겟" value={draft.target} onChange={(value) => setDraft({ ...draft, target: value })} />
            <Field label="영상 길이" value={draft.duration} onChange={(value) => setDraft({ ...draft, duration: value })} />
            <Field label="스타일" value={draft.style} onChange={(value) => setDraft({ ...draft, style: value })} />
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#FFFFFF]">아이디어</span>
              <textarea
                value={draft.idea}
                onChange={(event) => setDraft({ ...draft, idea: event.target.value })}
                rows={5}
                className="w-full rounded-md border border-[#FFFFFF]/25 bg-[#111111] px-4 py-3 text-[#FFFFFF] outline-none transition focus:border-[#60A5FA]"
              />
            </label>
            <div className="lg:col-span-2">
              <PrimaryButton label="Workspace 만들기" icon={<ArrowRight className="h-4 w-4" />} />
            </div>
          </form>
        </PageShell>
      )}

      {view === "workspace" && activeProject && (
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#FFFFFF]/20 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-[#60A5FA]">Workspace</p>
              <h1 className="mt-2 text-3xl font-black">{activeProject.title}</h1>
            </div>
            <button
              type="button"
              onClick={goDashboard}
              className="rounded-md border border-[#FFFFFF]/30 px-4 py-2 text-sm font-bold transition hover:border-[#60A5FA] hover:text-[#60A5FA]"
            >
              Dashboard
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
            <aside className="rounded-md border border-[#FFFFFF]/20 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold">Scene List</h2>
                <button
                  type="button"
                  onClick={addScene}
                  className="rounded-md border border-[#60A5FA] p-2 text-[#60A5FA] transition hover:bg-[#60A5FA] hover:text-[#111111]"
                  aria-label="add scene"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {activeProject.scenes.map((scene) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setFocusedSceneId(scene.id);
                      setImageError(null);
                    }}
                    className={`w-full rounded-md border px-3 py-3 text-left text-sm transition ${
                      scene.id === focusedSceneId
                        ? "border-[#60A5FA] text-[#60A5FA]"
                        : "border-[#FFFFFF]/20 text-[#FFFFFF] hover:border-[#60A5FA]"
                    }`}
                  >
                    <span className="block font-bold">{scene.title}</span>
                    <span className="mt-1 block text-xs text-[#FFFFFF]/60">{scene.duration}</span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-md border border-[#FFFFFF]/20 p-5">
              {focusedScene && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">Planning Area</h2>
                    <button
                      type="button"
                      onClick={() => deleteScene(focusedScene.id)}
                      className="rounded-md border border-[#FFFFFF]/30 p-2 transition hover:border-[#60A5FA] hover:text-[#60A5FA]"
                      aria-label="delete scene"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Field label="씬 제목" value={focusedScene.title} onChange={(value) => updateScene(focusedScene.id, { title: value })} />
                  <TextAreaField label="장면 설명" value={focusedScene.description} onChange={(value) => updateScene(focusedScene.id, { description: value })} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="길이" value={focusedScene.duration} onChange={(value) => updateScene(focusedScene.id, { duration: value })} />
                    <Field label="목적" value={focusedScene.purpose} onChange={(value) => updateScene(focusedScene.id, { purpose: value })} />
                  </div>
                  <TextAreaField label="카메라 구도" value={focusedScene.framing} onChange={(value) => updateScene(focusedScene.id, { framing: value })} />
                  <TextAreaField label="촬영 가이드" value={focusedScene.guide} onChange={(value) => updateScene(focusedScene.id, { guide: value })} />
                  <TextAreaField label="스크립트" value={focusedScene.script} onChange={(value) => updateScene(focusedScene.id, { script: value })} />
                </div>
              )}
            </section>

            <aside className="rounded-md border border-[#FFFFFF]/20 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">촬영 레퍼런스</h2>
                <span className="rounded-md border border-[#60A5FA] px-2 py-1 text-xs font-bold text-[#60A5FA]">
                  AI 이미지 생성
                </span>
              </div>

              {focusedScene && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">생성 설명</span>
                    <textarea
                      value={focusedScene.moodImagePrompt ?? ""}
                      onChange={(event) =>
                        updateScene(focusedScene.id, { moodImagePrompt: event.target.value })
                      }
                      rows={5}
                      className="w-full rounded-md border border-[#FFFFFF]/25 bg-[#111111] px-4 py-3 text-sm leading-6 text-[#FFFFFF] outline-none transition focus:border-[#60A5FA]"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateReferenceImage}
                    disabled={isGeneratingImage}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#60A5FA] px-4 py-3 text-sm font-extrabold text-[#111111] transition hover:bg-[#FFFFFF] disabled:border disabled:border-[#FFFFFF]/20 disabled:bg-[#111111] disabled:text-[#FFFFFF]/50"
                  >
                    {isGeneratingImage ? <Wand2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                    {isGeneratingImage ? "생성 중" : "촬영 레퍼런스 생성"}
                  </button>

                  <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border border-[#FFFFFF]/20">
                    {imageError ? (
                      <p className="px-4 text-center text-sm leading-6 text-[#FFFFFF]">{imageError}</p>
                    ) : focusedScene.moodImage?.startsWith("data:image/") ? (
                      <img
                        src={focusedScene.moodImage}
                        alt="촬영 레퍼런스"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <p className="px-4 text-center text-sm text-[#FFFFFF]/70">
                        생성 설명을 입력한 뒤 이미지를 생성하세요.
                      </p>
                    )}
                  </div>

                  {focusedScene.translatedEnglishPrompt && (
                    <div className="rounded-md border border-[#FFFFFF]/20 p-3">
                      <p className="mb-2 text-xs font-bold text-[#60A5FA]">English Prompt</p>
                      <p className="text-xs leading-5 text-[#FFFFFF]/80">
                        {focusedScene.translatedEnglishPrompt}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>
        </main>
      )}

      {view === "templates" && (
        <PageShell title="Templates">
          <div className="grid gap-4 md:grid-cols-3">
            {templates.map((template) => (
              <article key={template.title} className="rounded-md border border-[#FFFFFF]/20 p-5">
                <p className="text-sm font-bold text-[#60A5FA]">{template.duration}</p>
                <h2 className="mt-3 text-xl font-bold">{template.title}</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-[#FFFFFF]/75">{template.idea}</p>
                <button
                  type="button"
                  onClick={() => handleUseTemplate(template)}
                  className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#60A5FA] px-4 py-2 text-sm font-bold text-[#60A5FA] transition hover:bg-[#60A5FA] hover:text-[#111111]"
                >
                  <ArrowRight className="h-4 w-4" />
                  사용하기
                </button>
              </article>
            ))}
          </div>
        </PageShell>
      )}

      {view === "archive" && (
        <PageShell title="Archive">
          {archivedProjects.length === 0 ? (
            <EmptyState title="보관된 프로젝트가 없습니다." action="Dashboard로 이동" onClick={goDashboard} />
          ) : null}
        </PageShell>
      )}

      {view === "pricing" && (
        <PageShell title="Pricing">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Free", "과제 MVP 제작 시작"],
              ["Studio", "개인 영상 기획 확장"],
              ["Team", "팀 프로젝트 협업"],
            ].map(([plan, text]) => (
              <article key={plan} className="rounded-md border border-[#FFFFFF]/20 p-6">
                <h2 className="text-2xl font-black">{plan}</h2>
                <p className="mt-4 text-sm leading-6 text-[#FFFFFF]/75">{text}</p>
                <button
                  type="button"
                  onClick={() => setView("signup")}
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#60A5FA] px-4 py-2 text-sm font-extrabold text-[#111111] transition hover:bg-[#FFFFFF]"
                >
                  <Sparkles className="h-4 w-4" />
                  선택하기
                </button>
              </article>
            ))}
          </div>
        </PageShell>
      )}
    </div>
  );
}

function PageShell({
  title,
  children,
  actionLabel,
  onAction,
}: {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#FFFFFF]/20 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#60A5FA]">MONT</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">{title}</h1>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#60A5FA] px-4 py-2 text-sm font-extrabold text-[#111111] transition hover:bg-[#FFFFFF]"
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </main>
  );
}

function AuthShell({
  title,
  subtitle,
  footerText,
  footerAction,
  onFooterClick,
  children,
}: {
  title: string;
  subtitle: string;
  footerText: string;
  footerAction: string;
  onFooterClick: () => void;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-6 py-12">
      <section className="rounded-md border border-[#FFFFFF]/20 p-6">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#FFFFFF]/75">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 border-t border-[#FFFFFF]/20 pt-5 text-sm text-[#FFFFFF]/75">
          {footerText}{" "}
          <button type="button" onClick={onFooterClick} className="font-bold text-[#60A5FA]">
            {footerAction}
          </button>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#FFFFFF]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-[#FFFFFF]/25 bg-[#111111] px-4 py-3 text-[#FFFFFF] outline-none transition focus:border-[#60A5FA]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#FFFFFF]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full rounded-md border border-[#FFFFFF]/25 bg-[#111111] px-4 py-3 text-sm leading-6 text-[#FFFFFF] outline-none transition focus:border-[#60A5FA]"
      />
    </label>
  );
}

function PrimaryButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#60A5FA] px-5 py-3 text-sm font-extrabold text-[#111111] transition hover:bg-[#FFFFFF]"
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-md border border-[#FFFFFF]/20 p-5 text-left font-bold transition hover:border-[#60A5FA] hover:text-[#60A5FA]"
    >
      <span className="text-[#60A5FA]">{icon}</span>
      {label}
    </button>
  );
}

function EmptyState({
  title,
  action,
  onClick,
}: {
  title: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-md border border-[#FFFFFF]/20 p-8 text-center">
      <FolderOpen className="mx-auto mb-4 h-8 w-8 text-[#60A5FA]" />
      <p className="text-lg font-bold">{title}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#60A5FA] px-4 py-2 text-sm font-bold text-[#60A5FA] transition hover:bg-[#60A5FA] hover:text-[#111111]"
      >
        <ArrowRight className="h-4 w-4" />
        {action}
      </button>
    </div>
  );
}
