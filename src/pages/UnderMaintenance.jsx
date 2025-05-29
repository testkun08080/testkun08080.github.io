import onineko from "../assets/ojigi_animal_neko.png";

const UnderMaintenance = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-xl">
        <img
          src={onineko}
          className="w-48 h-48 object-contain mb-4"
          alt="kouji neko"
        />
        <h1 className="text-4xl font-bold mb-4">誠心誠意工事中です</h1>
        <p className="text-lg text-center mb-4">またのお越しをお待ちしてます</p>
      </div>
    </div>
  );
};

export default UnderMaintenance;
