import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom";
import ListToDo from "./ListToDo";
import AllOrder from "./AllOrder";
import Footer from "../Footer";
import SideBar from "./SideBar";
import AllProduct from "../shop/allProduct";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddProduct from "./AddProduct";

const SellerHome = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const [allProduct, setAllProduct] = useState()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const shopApi = await axios.get(`http://localhost:8080/shop/${user.id}`)
                setAllProduct(shopApi.data.products)
                // console.log(shopApi.data.products);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [user.id])



    return (
        <div style={{ background: "#F5F5F5", }}>

            <div style={{ borderBottom: "1px solid #F5F5F5", background: "white" }}>
                <Container style={{ padding: "25px 0", }}>
                    <div style={{ fontSize: "25px", display: "flex" }}>
                        <Link to={"/"}><img src="../images/logo2.png" alt="logo" style={{ height: "70px" }} /></Link>
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>Kênh người bán</div>
                    </div>
                </Container>
            </div>
            <Row style={{ padding: "0 15px" }}>
                <Col xs={3}>
                    <SideBar />
                </Col>
                <Col xs={9} >
                    <ListToDo shop={user} />
                    <AllOrder shop={user} />
                    <h5 style={{ marginTop: "20px" }}>Tất cả sản phẩm</h5>
                    <AllProduct allProduct={allProduct} status={"ok"} />

                    <h5 style={{ marginTop: "20px" }}>Đang chờ duyệt</h5>
                    <AllProduct allProduct={allProduct} status={"Đang chờ duyệt"} />

                    <h5 style={{ marginTop: "20px" }}>Sản phẩm bị khóa</h5>
                    <AllProduct allProduct={allProduct} status={"Cấm"} />
                    
                    <h5 style={{ marginTop: "20px" }}>Thêm mới sản phẩm</h5>
                    <AddProduct />
                </Col>
            </Row>
            <br />
            <Footer />
        </div>
    )
}
export default SellerHome