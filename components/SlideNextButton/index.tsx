import { ChevronRight } from "lucide-react";
import { FC } from "react";
import { useSwiper } from "swiper/react";

const SlideNextButton: FC = () => {
  const swiper = useSwiper();

  return (
    <button onClick={() => swiper.slideNext()}>
      <div className="border p-4">
        <ChevronRight />
      </div>
    </button>
  );
};

export default SlideNextButton;
