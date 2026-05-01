export type ToolItem = {
  name: string;
  iconPath?: string;
  iconEmoji?: string;
};

export type ToolCategory = {
  id: string;
  title: string;
  role: string;
  tools: ToolItem[];
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "creative-tools-3d-design",
    title: "Creative Tools (3D & Design)",
    role: "アセット制作、スカルプティング、テクスチャリング、デザイン",
    tools: [
      { name: "Maya", iconPath: "/skills-icons/tool_maya.svg" },
      { name: "Houdini", iconPath: "/skills-icons/tool_houdini.svg" },
      { name: "Blender", iconPath: "/skills-icons/tool_blender.svg" },
      { name: "ZBrush", iconPath: "/skills-icons/tool_zbrush.svg" },
      { name: "Substance Painter", iconPath: "/skills-icons/tool_painter.svg" },
      {
        name: "Substance Designer",
        iconPath: "/skills-icons/tool_designer.svg",
      },
      { name: "Affinity", iconPath: "/skills-icons/tool_affinity.svg" },
      { name: "Figma", iconPath: "/skills-icons/tool_figma.svg" },
      { name: "After Effects", iconPath: "/skills-icons/tool_ae.svg" },
      { name: "Premiere Pro", iconPath: "/skills-icons/tool_pr.svg" },
      // { name: "Adobe XD", iconPath: "/skills-icons/tool_xd.svg" },
      { name: "Photoshop", iconPath: "/skills-icons/tool_ps.svg" },
      { name: "Illustrator", iconPath: "/skills-icons/tool_ai.svg" },
      { name: "Lightroom", iconPath: "/skills-icons/tool_lightroom.svg" },
    ],
  },
  {
    id: "graphics-game-engines",
    title: "Graphics & Game Engines",
    role: "シェーダー開発、レンダリング最適化、ゲームロジック実装",
    tools: [
      { name: "Unity", iconPath: "/skills-icons/tool_unity.svg" },
      { name: "Unreal Engine", iconPath: "/skills-icons/tool_ue4.svg" },
      // { name: "OpenGL", iconPath: "/skills-icons/lang_opengl.svg" },
      // { name: "Maya Language", iconPath: "/skills-icons/lang_maya.svg" },
    ],
  },
  {
    id: "web-app-development",
    title: "Web & App Development",
    role: "フロントエンド開発、UI実装、Web向け機能開発",
    tools: [
      { name: "React", iconPath: "/skills-icons/lang_react.svg" },
      { name: "Flutter", iconPath: "/skills-icons/icon_flutter.svg" },
      {
        name: "Kotlin Multiplatform",
        iconPath: "/skills-icons/kotlin-multiplatform-icon.svg",
      },
    ],
  },
  {
    id: "platform-infrastructure",
    title: "Platform & Infrastructure",
    role: "基盤開発、データ処理、低レイヤー実装",
    tools: [
      {
        name: "Cloudflare",
        iconPath: "/skills-icons/cloudflare-color.svg",
      },
      {
        name: "Vercel",
        iconPath: "/skills-icons/vercel-icon-light.svg",
      },
    ],
  },
  {
    id: "development-operations",
    title: "Development Operations (DevOps & Tools)",
    role: "バージョン管理、CI/CD、環境統一、チーム運用",
    tools: [
      { name: "Git", iconPath: "/skills-icons/tool_git.svg" },
      { name: "Docker", iconPath: "/skills-icons/tool_docker.svg" },
      { name: "Jenkins", iconPath: "/skills-icons/tool_jenkins.svg" },
      { name: "Perforce", iconPath: "/skills-icons/tool_p4.svg" },
    ],
  },
  {
    id: "programming-languages",
    title: "Programming-Languages",
    role: "実装、マークアップ、スタイリング、クエリ、シェーダー記述",
    tools: [
      { name: "Python", iconPath: "/skills-icons/python.svg" },
      { name: "HLSL", iconPath: "/skills-icons/lang_hlsl.svg" },
      { name: "GLSL", iconPath: "/skills-icons/lang_glsl.svg" },
      {
        name: "TypeScript",
        iconPath: "/skills-icons/ts-logo-128.svg",
      },
      { name: "HTML", iconPath: "/skills-icons/lang_html.svg" },
      { name: "CSS", iconPath: "/skills-icons/lang_css.svg" },
      {
        name: "SQL",
        iconPath: "/skills-icons/sql-database-with-logo.svg",
      },
      { name: "C", iconPath: "/skills-icons/lang_c.svg" },
      { name: "C++", iconPath: "/skills-icons/lang_c++.svg" },
      { name: "C#", iconPath: "/skills-icons/lang_csya.svg" },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    role: "コミュニケーション、仕様理解、ドキュメント対応",
    tools: [
      { name: "日本語", iconEmoji: "🇯🇵" },
      { name: "English", iconEmoji: "🇬🇧" },
    ],
  },
];
