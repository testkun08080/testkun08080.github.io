import React from 'react';
import langOpengl from '../assets/lang_opengl.svg';
import langHlsl from '../assets/lang_hlsl.svg';
import langMaya from '../assets/lang_maya.svg';
import langReact from '../assets/lang_react.svg';
import { useTranslation } from 'react-i18next';

const languages = [
  { name: 'Python', devicon: 'devicon-python-plain colored' },
  { name: 'OpenGL', svg: langOpengl },
  { name: 'HLSL', svg: langHlsl },
  { name: 'Maya', svg: langMaya },
  { name: 'HTML', devicon: 'devicon-html5-plain colored' },
  { name: 'CSS', devicon: 'devicon-css3-plain colored' },
  { name: 'C', devicon: 'devicon-c-plain colored' },
  { name: 'C#', devicon: 'devicon-csharp-plain colored' },
  { name: 'C++', devicon: 'devicon-cplusplus-plain colored' },
  { name: 'React', svg: langReact },
];

const AboutProgrammingLanguages = () => {
  const { t } = useTranslation();
  return (
    <div style={{
      background: 'transparent',
      padding: 24,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 16,
    }}>
      <div className="font-semibold text-2xl text-black mb-2 text-left">{t('about_programming_title')}</div>
      <hr className="w-full border-t-2 border-black mb-4" />
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 18, justifyContent: 'center', alignItems: 'center' }}>
        {languages.map(lang => (
          <div key={lang.name} title={lang.name} style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {lang.svg ? (
              <img src={lang.svg} alt={lang.name} style={{ width: 34, height: 34 }} />
            ) : lang.devicon ? (
              <i className={lang.devicon + ' text-[34px]'}></i>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutProgrammingLanguages; 