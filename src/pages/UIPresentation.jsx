import KitchenUI from "../components/KitchenUI";
import WaiterUI from "../components/WaiterUI";
import CashierUI from "../components/CashierUI";

import { Swiper, SwiperSlide } from 'swiper/react';
import AppLayout from "../ui/AppLayout";

export default function UIPresentation() {
    return (
        <div className="">
            <Swiper spaceBetween={20} slidesPerView={1}>
                <SwiperSlide><KitchenUI /></SwiperSlide>
                <SwiperSlide><WaiterUI /></SwiperSlide>
                <SwiperSlide><CashierUI /></SwiperSlide>
                <SwiperSlide><AppLayout /></SwiperSlide>
            </Swiper>
        </div>
    )
}
