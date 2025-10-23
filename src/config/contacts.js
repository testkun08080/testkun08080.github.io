/**
 * 連絡先情報の一元管理
 * メールアドレス、SNSリンクなどの固定情報をここで管理
 */

export const CONTACT_INFO = {
  // メールアドレス
  email: "testkun.08080@gmail.com",

  // ウェブサイト
  website: "testkun08080.github.io",

  // SNSリンク
  social: {
    github: {
      username: "testkun08080",
      url: "https://github.com/testkun08080",
      iconClass: "devicon-github-original colored",
    },
    linkedin: {
      username: "testkun08080",
      url: "https://linkedin.com/in/testkun08080",
      iconClass: "devicon-linkedin-plain colored",
    },
    twitter: {
      username: "testkun08080",
      url: "https://twitter.com/testkun08080",
      iconClass: "devicon-twitter-original colored",
    },
  },
};

// メールリンク生成ヘルパー
export const getMailtoLink = (subject = "Contact from Portfolio", body = "") => {
  return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

// SNS配列を取得（コンポーネントで使いやすい形式）
export const getSocialList = () => {
  return Object.entries(CONTACT_INFO.social).map(([key, value]) => ({
    id: key,
    name: `about_profile_${key}`, // i18nキー
    ...value,
  }));
};

export default CONTACT_INFO;
