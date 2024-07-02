import { Routes, Route } from "react-router-dom";
import Home from '../userPage/Home';
import Signin from '../userPage/authenticate/Signin';
import SignupE from '../userPage/authenticate/SignupE';
import VerifyEmail from "../userPage/authenticate/VerifyEmail";
import SignupS from "../userPage/authenticate/SignupS";
import DetailProduct from "../userPage/product/detailProduct";
import ShopDetail from "../userPage/shop/shopDetail";
const AppRoutes = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/signupS' element={<SignupS />} />
                <Route path='/signupE' element={<SignupE />} />
                <Route path="/verifyEmail" element={<VerifyEmail />} />

                <Route path="/product/:id" element={<DetailProduct />} />

                <Route path="/shop/:id" element={<ShopDetail />} />
            </Routes>
        </div>
    )
}
export default AppRoutes