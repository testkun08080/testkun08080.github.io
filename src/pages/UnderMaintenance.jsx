import onineko from "../assets/ojigi_animal_neko.png";
import { useTranslation } from 'react-i18next';

const UnderMaintenance = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
      <div className="flex flex-col items-center p-8 rounded-xl">
        <img
          src={onineko}
          className="w-48 h-48 object-contain mb-4"
          alt="kouji neko"
        />
        <h1 className="text-4xl font-bold mb-4">{t('undermaintenance_title')}</h1>
        <p className="text-lg text-center mb-4">{t('undermaintenance_message')}</p>
      </div>
    </div>
  );
};

export default UnderMaintenance;


