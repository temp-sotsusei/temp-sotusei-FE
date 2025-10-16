import { ChevronLeft } from "lucide-react";
import { FC } from "react";
import { useSwiper } from "swiper/react";

const SlidePrevButton: FC = () => {
  const swiper = useSwiper();

  return (
    <button
      onClick={() => {
        swiper.slidePrev();
      }}
    >
      <div className="border p-4">
        <ChevronLeft />
      </div>
    </button>
  );
};

export default SlidePrevButton;
