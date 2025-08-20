import React from 'react';
import Wrapper from '../components/Wrapper';
import SnsIcons from '../components/SnsIcons';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <Wrapper style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          background: 'rgba(28, 28, 28, 0.05)',
          borderRadius: 16,
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          border: '3px solid #000',
          padding: 48,
          minWidth: 350,
          maxWidth: 627,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 33,
        }}
      >
        <div
          className="text-2xl font-normal text-black text-center leading-[1.21] whitespace-pre-line"
        >
          {t('contact_info')}
        </div>
        <SnsIcons size={48} gap={15} />
      </div>
    </Wrapper>
  );
};

export default Contact; 