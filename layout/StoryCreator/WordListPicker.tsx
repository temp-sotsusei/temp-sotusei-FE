'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import WordList2 from "@/components/WordLIst2";

type Props = {
  wordsList: string[][]
  selectWords: (selectWordsIndex: number) => void
}

const WordListPicker: FC<Props> = ({wordsList, selectWords}) => {

  return (
    <>
      <p className='text-lg font-bold'>ものがたり<span className='text-base mx-1'>の</span>たんご<span className='text-base mx-1'>を</span>えらぼう！</p>
        <div className="w-full space-y-8">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 120,
              modifier: 5,
              slideShadows: false,
            }}
            pagination={{ 
              clickable: true,
            }}
            navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            onSlideChange={(swiper) => selectWords(swiper.realIndex)}
            className="relative max-w-xl [&>div.swiper-wrapper]:mt-12"
          >
            {wordsList.map((words, i) => (
              <SwiperSlide key={i}>
                <WordList2 wordList={words} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="w-full flex justify-center gap-48">
            <div className="
              swiper-button-prev text-[#93C400] text-3xl font-bold flex items-center justify-center
              transition-transform duration-150
              hover:scale-125 active:scale-125
              cursor-pointer"
            >
              <FaChevronLeft />
            </div>
            <div
              className="
                swiper-button-next text-[#93C400] text-3xl font-bold flex items-center justify-center
                transition-transform duration-75
                hover:scale-125 active:scale-125
                cursor-pointer
              "
            >
              <FaChevronRight />
          </div>
        </div>
      </div>
    </>
  )
}

export default WordListPicker