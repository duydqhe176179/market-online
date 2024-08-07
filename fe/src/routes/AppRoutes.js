import { Routes, Route } from "react-router-dom";
import Home from '../userPage/Home';
import Signin from '../userPage/authenticate/Signin';
import SignupE from '../userPage/authenticate/SignupE';
import VerifyEmail from "../userPage/authenticate/VerifyEmail";
import SignupS from "../userPage/authenticate/SignupS";
import DetailProduct from "../userPage/product/detailProduct";
import ShopDetail from "../userPage/shop/shopDetail";
import Cart from "../userPage/cart/Cart";
import Order from "../userPage/order/Order";
import SellerHome from "../userPage/seller/SellerHome";
import User from "../userPage/user/User";
import ViewAllProduct from "../userPage/ViewAllProduct";
import HomeAdmin from "../adminPage/Home";
import SigninAdmin from "../adminPage/authenticate/Signin";
import DetailAccount from "../adminPage/component/DetailAccount";
import ListUser from "../adminPage/component/ListUser";
import Categories from "../adminPage/component/Categories";
import ProductAdmin from "../adminPage/component/ProductAdmin";
import OrderAdmin from "../adminPage/component/OrderAdmin";
import ReportAdmin from "../adminPage/component/ReportAdmin";
import Overview from "../adminPage/component/Overview";
import CSKH from "../CSKH";
import NotificationAdmin from "../adminPage/component/NotificationAdmin";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signupS' element={<SignupS />} />
            <Route path='/signupE' element={<SignupE />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path="/cskh" element={<CSKH />} />

            <Route path="/product/:id" element={<DetailProduct />} />

            <Route path="/shop/:id" element={<ShopDetail />} />

            <Route path="/cart/:idUser" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/seller" element={<SellerHome />} />

            <Route path="/user" element={<User />} />
            <Route path="/user/profile" element={<User view={"profile"} />} />
            <Route path="/user/phone" element={<User view={"phone"} />} />
            <Route path="/user/password" element={<User view={"password"} />} />
            <Route path="/user/purchaseOrder" element={<User view={"purchaseOrder"} />} />
            <Route path="/user/notification" element={<User view={"notification"} />} />

            <Route path="/allProduct" element={<ViewAllProduct />} />


            <Route path="/admin" element={<HomeAdmin />} />
            <Route path="/admin/signin" element={<SigninAdmin />} />
            <Route path="/admin/overview" element={<Overview />} />
            <Route path="/admin/accounts" element={<ListUser />} />
            <Route path="/admin/detailAccount" element={<DetailAccount />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/products" element={<ProductAdmin />} />
            <Route path="/admin/orders" element={<OrderAdmin />} />
            <Route path="/admin/reports" element={<ReportAdmin />} />
            <Route path="/admin/notification" element={<NotificationAdmin />} />

        </Routes>
    )
}

export default AppRoutes