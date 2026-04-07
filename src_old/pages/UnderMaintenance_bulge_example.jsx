import onineko from "../assets/ojigi_animal_neko.png";
import { useTranslation } from "react-i18next";
import BulgeTextOverlay from "../components/BulgeTextOverlay";

/**
 * UnderMaintenance with BulgeTextOverlay effect
 *
 * BulgeTextOverlayを使用した例
 */
const UnderMaintenanceWithBulge = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Background Bulge Effect */}
      <BulgeTextOverlay intensity={1.0} smoothness={0.5}>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-9xl font-bold text-gray-800 opacity-20">
            UNDER MAINTENANCE
          </h1>
        </div>
      </BulgeTextOverlay>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-gray-800">
        <div className="flex flex-col items-center p-8 rounded-xl bg-white/80 backdrop-blur-sm">
          <img
            src={onineko}
            className="w-48 h-48 object-contain mb-4"
            alt="kouji neko"
          />
          <h1 className="text-4xl font-bold mb-4">
            {t("undermaintenance_title")}
          </h1>
          <p className="text-lg text-center mb-4">
            {t("undermaintenance_message")}
          </p>
        </div>
      </div>
    </>
  );
};

export default UnderMaintenanceWithBulge;
