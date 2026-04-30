export type ToolItem = {
  name: string;
  iconPath?: string;
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
    title: "1. Creative Tools (3D & Design)",
    role: "アセット制作、スカルプティング、テクスチャリング、デザイン",
    tools: [
      { name: "Maya", iconPath: "/tool-icons/tool_maya.svg" },
      { name: "Houdini", iconPath: "/tool-icons/tool_houdini.svg" },
      { name: "Blender", iconPath: "/tool-icons/tool_blender.svg" },
      { name: "ZBrush", iconPath: "/tool-icons/tool_zbrush.svg" },
      { name: "Substance Painter", iconPath: "/tool-icons/tool_painter.svg" },
      { name: "Substance Designer", iconPath: "/tool-icons/tool_designer.svg" },
      { name: "Photoshop", iconPath: "/tool-icons/tool_ps.svg" },
      { name: "Illustrator", iconPath: "/tool-icons/tool_ai.svg" },
      { name: "After Effects", iconPath: "/tool-icons/tool_ae.svg" },
      { name: "Premiere Pro", iconPath: "/tool-icons/tool_pr.svg" },
      { name: "Adobe XD", iconPath: "/tool-icons/tool_xd.svg" },
      { name: "Lightroom", iconPath: "/tool-icons/tool_lightroom.svg" },
    ],
  },
  {
    id: "graphics-game-engines",
    title: "2. Graphics & Game Engines",
    role: "シェーダー開発、レンダリング最適化、ゲームロジック実装",
    tools: [
      { name: "Unity", iconPath: "/tool-icons/tool_unity.svg" },
      { name: "Unreal Engine", iconPath: "/tool-icons/tool_ue4.svg" },
      { name: "OpenGL", iconPath: "/plang-icons/lang_opengl.svg" },
      { name: "Maya Language", iconPath: "/plang-icons/lang_maya.svg" },
    ],
  },
  {
    id: "web-app-development",
    title: "3. Web & App Development",
    role: "フロントエンド開発、UI実装、Web向け機能開発",
    tools: [
      { name: "React", iconPath: "/plang-icons/lang_react.svg" },
      { name: "Flutter" },
      { name: "Kotlin Multiplatform" },
    ],
  },
  {
    id: "platform-infrastructure",
    title: "4. Platform & Infrastructure",
    role: "基盤開発、データ処理、低レイヤー実装",
    tools: [
      { name: "Cloudflare" },
      { name: "Vercel" },
    ],
  },
  {
    id: "development-operations",
    title: "5. Development Operations (DevOps & Tools)",
    role: "バージョン管理、CI/CD、環境統一、チーム運用",
    tools: [
      { name: "Git", iconPath: "/tool-icons/tool_git.svg" },
      { name: "Docker", iconPath: "/tool-icons/tool_docker.svg" },
      { name: "Jenkins", iconPath: "/tool-icons/tool_jenkins.svg" },
      { name: "Perforce", iconPath: "/tool-icons/tool_p4.svg" },
    ],
  },
  {
    id: "programming-languages",
    title: "6. Languages",
    role: "実装、マークアップ、スタイリング、クエリ、シェーダー記述",
    tools: [
      { name: "TypeScript" },
      { name: "HTML", iconPath: "/plang-icons/lang_html.svg" },
      { name: "CSS", iconPath: "/plang-icons/lang_css.svg" },
      { name: "SQL" },
      { name: "C", iconPath: "/plang-icons/lang_c.svg" },
      { name: "C++", iconPath: "/plang-icons/lang_c++.svg" },
      { name: "C#", iconPath: "/plang-icons/lang_c#.svg" },
      { name: "Python", iconPath: "/plang-icons/python.svg" },
      { name: "HLSL", iconPath: "/plang-icons/lang_hlsl.svg" },
    ],
  },
];
