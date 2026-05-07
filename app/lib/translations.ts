export type Language = "ja" | "en";

export const messages = {
  ja: {
    nav_home: "ホーム",
    nav_sunaba: "すなば",
    nav_about: "アバウト",
    nav_reels: "リール",
    nav_contact: "コンタクト",
    nav_language: "言語",
    hero_title: "ようこそ",
    hero_subtitle: "テクノロジーとアートをつなぐポートフォリオ",
    hero_cta_primary: "すなばへ",
    hero_cta_secondary: "アバウトへ",
    hero_description:
      "Vike + React へ移行した新しいサイトです。マットな質感と滑らかなアニメーションで再構築しました。",
    sunaba_jp: "すなば",
    sunaba_en: "sunaba",
    sunaba_message: "実験と表現のためのサンドボックス",
    about_title: "アバウト",
    about_greeting:
      "はじめまして！\n(๑•᎑•๑)\nただ面白いと思ったことをただひたすらにやることを決めて生きています。\nその中でもアートやコンテンツを支援・創造することに楽しみを感じています。\n特にレンダリングやシェーダー開発が得意分野です。\n技術面とアート面の問題を解決しながら最後までプロジェクトを成功させる時が快感です",
    about_resume: "履歴書",
    about_section_title2: "スキル・自己紹介",
    about_profile_name: "長谷川 翔一",
    about_profile_contact:
      "🧑‍💻(testkun08080.github.io)\n✉️(testkun.08080@gmail.com)",
    about_qualifications_title: "資格・強み",
    about_qualifications_desc:
      "ゲーム業界で7年以上、シェーダー、LookDev、パイプライン整備に携わってきました。エンジニアとアーティスト双方の視点で、制作フローを最適化します。",
    about_tools_title: "使用ソフト・ツール",
    about_tools_list:
      "UE, Unity, Maya, Houdini, Blender, Substance, Docker, Git",
    about_programming_title: "プログラミング",
    about_programming_list: "Python, OpenGL, HLSL, C#, C++, React, TypeScript",
    about_hobbies_title: "趣味",
    about_hobbies_list: [
      "カメラ",
      "温泉・サウナ",
      "料理",
      "映画鑑賞",
      "街歩き",
    ],
    reels_title: "リール",
    reels_2022_2024: "Reel 2022-2024",
    reels_2022_2024_desc: "2022年から2024年のリール作品集",
    reels_2017_2022: "Reel 2017-2022",
    reels_2017_2022_desc: "2017年から2022年のリール作品集",
    contact_title: "コンタクト",
    contact_info: "🧑‍💻(testkun08080.github.io)\n✉️(testkun.08080@gmail.com)",
    contact_email_plain: "testkun.08080@gmail.com",
    contact_message: "ご相談・ご依頼はお気軽にご連絡ください。",
    not_found_title: "404",
    not_found_message: "お探しのページは見つかりませんでした。",
    not_found_back: "トップへ戻る",
    footer_copyright: "© SHOICHI HASEGAWA 2026",
  },
  en: {
    nav_home: "Home",
    nav_sunaba: "Sunaba",
    nav_about: "About",
    nav_reels: "Reels",
    nav_contact: "Contact",
    nav_language: "Language",
    hero_title: "Welcome",
    hero_subtitle: "A portfolio bridging technology and art",
    hero_cta_primary: "Enter Sunaba",
    hero_cta_secondary: "About",
    hero_description:
      "This site has been migrated to Vike + React, refined with matte textures and smooth motion.",
    sunaba_jp: "SUNABA",
    sunaba_en: "sunaba",
    sunaba_message: "A sandbox for experiments and expression",
    about_title: "About",
    about_greeting:
      "Nice to meet you!\nI'm Shoichi Hasegawa from Japan (๑•᎑•๑)\nI am passionate about creating and supporting outstanding art through technology, especially LookDev and shader development.\nWith both engineering and art backgrounds, I bridge technical problem-solving and creative vision.",
    about_resume: "Resume",
    about_section_title2: "Skills and profile",
    about_profile_name: "Shoichi Hasegawa",
    about_profile_contact:
      "🧑‍💻(testkun08080.github.io)\n✉️(testkun.08080@gmail.com)",
    about_qualifications_title: "Qualifications",
    about_qualifications_desc:
      "7+ years in game production across shaders, LookDev, and pipeline work. I bridge engineering and art to improve workflows.",
    about_tools_title: "Tools",
    about_tools_list:
      "UE, Unity, Maya, Houdini, Blender, Substance, Docker, Git",
    about_programming_title: "Programming",
    about_programming_list: "Python, OpenGL, HLSL, C#, C++, React, TypeScript",
    about_hobbies_title: "Hobbies",
    about_hobbies_list: [
      "Photography",
      "Onsen / Sauna",
      "Cooking",
      "Watching movies",
      "City walks",
    ],
    reels_title: "Reels",
    reels_2022_2024: "Reel 2022-2024",
    reels_2022_2024_desc: "Reel highlights from 2022 to 2024",
    reels_2017_2022: "Reel 2017-2022",
    reels_2017_2022_desc: "Reel highlights from 2017 to 2022",
    contact_title: "Contact",
    contact_info: "🧑‍💻(testkun08080.github.io)\n✉️(testkun.08080@gmail.com)",
    contact_email_plain: "testkun.08080@gmail.com",
    contact_message: "Feel free to reach out for collaborations or inquiries.",
    not_found_title: "404",
    not_found_message: "The page you are looking for cannot be found.",
    not_found_back: "Back to Top",
    footer_copyright: "© SHOICHI HASEGAWA 2026",
  },
} as const;

export type MessageKey = keyof (typeof messages)["ja"];

export type ProductionHomeCopy = {
  greetingFrontWord: string;
  greetingBgRowText: string;
  aboutHeading: string;
  aboutText: string;
  sideWords: readonly string[];
  workHeading: string;
  skillsHeading: string;
  contactHeading: string;
  menuButton: string;
  menuLanguageLabel: string;
  menuItems: { href: string; label: string }[];
  reelsFallbackPrefix: string;
  reelsFallbackLink: string;
  skillsShowMore: string;
  skillsClose: string;
  resumeHeading: string;
  resumeJaLabel: string;
  resumeEnLabel: string;
  resumeDownloadLabel: string;
  footerLanguageAriaLabel: string;
};

export const productionHomeCopy: Record<Language, ProductionHomeCopy> = {
  ja: {
    greetingFrontWord: "KONNNICHIWA!",
    greetingBgRowText:
      "11000001010011 11000010010011 11000001101011 11000001100001 11000010001111 1111111100000001 111110100100000 110011001110100 11000010001001 11000001010111 11000001000100 1111111100010001 110010111100101 11000010010010 1111111100000001",
    aboutHeading: "About",
    aboutText: `はじめまして！\n(๑•᎑•๑)\nただ面白いと思ったことをただひたすらにやることを決めて生きています。\nその中でもアートやコンテンツを支援・創造することに楽しみを感じています。\n特にレンダリングやシェーダー開発が得意分野です。\n技術面とアート面の問題を解決しながら最後までプロジェクトを成功させる時が快感です。`,
    sideWords: [
      "ルックデブ",
      "シェーダー開発",
      "クリエイティブコーディング",
      "ご縁を大切に",
      "ただ面白物を制作",
      "ビジュアル制作",
    ],
    workHeading: "Work",
    skillsHeading: "Skills",
    contactHeading: "Contact",
    menuButton: "メニュー",
    menuLanguageLabel: "言語",
    menuItems: [
      { href: "#hero", label: "TOP" },
      { href: "#sticky-side", label: "自己紹介" },
      { href: "#work", label: "作品" },
      { href: "#skills", label: "スキル" },
      { href: "#contact", label: "連絡先" },
    ],
    reelsFallbackPrefix: "埋め込みが表示されない場合は",
    reelsFallbackLink: "YouTubeで開く",
    skillsShowMore: "もっと見る",
    skillsClose: "閉じる",
    resumeHeading: "レジュメをダウンロード",
    resumeJaLabel: "日本語",
    resumeEnLabel: "英語",
    resumeDownloadLabel: "ダウンロード",
    footerLanguageAriaLabel: "日本語と英語を切り替える",
  },
  en: {
    greetingFrontWord: "konchiwa",
    greetingBgRowText: "hi there hello oi",
    aboutHeading: "About",
    aboutText: `Nice to meet you!
I'm Shoichi Hasegawa from Japan (๑•᎑•๑)
I am passionate about creating and supporting outstanding art through technology, especially LookDev and shader development.
With both engineering and art backgrounds, I bridge technical problem-solving and creative vision.`,
    sideWords: [
      "lookdev pipeline",
      "shader support",
      "creative coding",
      "scroll linked",
      "animejs motion",
      "visual crafting",
    ],
    workHeading: "Work",
    skillsHeading: "Skills",
    contactHeading: "Contact",
    menuButton: "Menu",
    menuLanguageLabel: "Language",
    menuItems: [
      { href: "#hero", label: "TOP" },
      { href: "#sticky-side", label: "about" },
      { href: "#work", label: "work" },
      { href: "#skills", label: "skills" },
      { href: "#contact", label: "contact" },
    ],
    reelsFallbackPrefix: "If the embed is unavailable,",
    reelsFallbackLink: "open on YouTube",
    skillsShowMore: "Show more",
    skillsClose: "Close",
    resumeHeading: "Download Resume",
    resumeJaLabel: "Japanese",
    resumeEnLabel: "English",
    resumeDownloadLabel: "Download",
    footerLanguageAriaLabel: "Switch language between Japanese and English",
  },
};
