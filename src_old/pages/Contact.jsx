import Wrapper from "../components/Wrapper";
import SnsIcons from "../components/SnsIcons";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <div className="w-xl  aspect-[1.65/1] bg-[rgba(28,28,28,0.05)] rounded-2xl border-[3px] border-black flex flex-col gap-10 justify-center items-center p-10">
        <div className="text-2xl font-normal text-black text-center leading-[1.21] whitespace-pre-line">
          {t("contact_info")}
        </div>
        <SnsIcons size={48} gap={15} />
      </div>
    </Wrapper>
  );
};

export default Contact;
