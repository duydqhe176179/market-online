import { useEffect, useState } from "react";
import Header from "../Header";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../Footer";
import { FaLocationDot } from "react-icons/fa6";
import formatNameProduct from "../../function/formatNameProduct";
import formatMoney from "../../function/formatMoney";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Order = () => {
    const [orderItem, setOrderItem] = useState(null);
    const [user, setUser] = useState(null);
    const [shopOrder, setShopOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalOrder, setTotalOrder] = useState(0)
    const [payMethod, setPayMethod] = useState("cod")
    const navigate = useNavigate()

    useEffect(() => {
        const orderItemLocal = JSON.parse(localStorage.getItem("order"));
        const userLocal = JSON.parse(localStorage.getItem("user"));
        const shopOrderLocal = JSON.parse(localStorage.getItem("shopOrder"));
        setTotalOrder(orderItemLocal.reduce((total, item) => total + item.product.price * (100 - item.product.sale) / 100 * item.quantity, 0))


        setOrderItem(orderItemLocal);
        setUser(userLocal);
        setShopOrder(shopOrderLocal);
        setLoading(false);
    }, []);

    const shopStyle = {
        marginBottom: "20px",
        background: "white"
    };

    if (loading) {
        return <div>Loading...</div>; // Bạn có thể thay thế bằng một spinner hoặc component loading khác
    }
    const handleOrder = async () => {
        const info = orderItem.map(order => {
            return {shopId:order.product.shop.id ,productId: order.product.idProduct, quantity: order.quantity, price:order.quantity*(order.product.price*(100-order.product.sale)/100) }
        })
        console.log(info);  
        const bill = {
            userId: user.id,
            orderItems: info,
            payMethod: payMethod
        }
        const idCartList = orderItem.map(order => {
            return order.id
        })
        try {
            const response = await axios.post("http://localhost:8080/order", bill)
            console.log(response);
            if (response.data === "order success") {
                idCartList.forEach(idCart => {
                    axios.post(`http://localhost:8080/cart/delete?idCart=${idCart}`)
                });
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Đặt hàng thành công',
                    showConfirmButton: false,
                    html: '<p>Đang chuyển hướng đến trang đơn mua...</p>',
                    timer: 1500,
                    height: "200px"
                });
                setTimeout(() => {
                    navigate('/user/purchaseOrder'); // Redirect to the signin page after 2 seconds
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handlePayMethodChange = (event) => {
        setPayMethod(event.target.value);
    };
    return (
        <div style={{ background: "#F5F5F5" }}>
            <Header />
            <Container style={{ background: "white", padding: "20px 20px", color: "#FC5731", borderBottom: "solid 1px #F5F5F5" }}>
                <div style={{ fontSize: "25px" }}>Thanh toán</div>
            </Container>
            <br />
            <Container style={{ background: "white", marginBottom: "10px", padding: "30px 25px" }}>
                <div style={{ fontSize: "18px" }}>
                    <span style={{ color: "#FC5731" }}><FaLocationDot /></span>
                    <span> Địa chỉ nhận hàng</span>
                </div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ marginBottom: "0", fontWeight: "bold", marginRight: "20px" }}>
                            {user.name}&nbsp;&nbsp;&nbsp;{user.phone}
                        </div>
                        <div>{user.address}</div>
                        <button style={{ background: "none", border: "none", color: "#008AD3", marginLeft: "20px" }}>Thay đổi</button>
                    </div>
                    <div>Phí vận chuyển: 20.000đ - 50.000đ</div>
                </div>
            </Container>
            <Container style={{ background: "white", padding: "20px 15px" }}>
                <div className="row" style={{ marginBottom: "30px" }}>
                    <Col xs={6} style={{ fontSize: "20px", color: "#AB9882" }}>
                        Sản phẩm
                    </Col>
                    <Col xs={6} className="row">
                        <Col xs={4} style={{ textAlign: "center" }}>Đơn giá</Col>
                        <Col xs={4} style={{ textAlign: "center" }}>Số lượng</Col>
                        <Col xs={4} style={{ textAlign: "center" }}>Thành tiền</Col>
                    </Col>
                </div>
            </Container>
            {shopOrder.map((shop) => (
                <Container key={shop.id} style={shopStyle}>
                    <div style={{ fontSize: "20px" }}>{shop?.name}</div>
                    {orderItem
                        .filter((item) => item.product.shop.id === shop.id)
                        .map((item) => (
                            <Row key={item.product.idProduct}>
                                <Col xs={6} style={{ marginBottom: "10px" }} className="row">
                                    <Col xs={2}>
                                        <img
                                            src={`${item?.product.image[0]}`}
                                            style={{ width: "100%" }}
                                            alt="Product"
                                        />
                                    </Col>
                                    <Col xs={7}>
                                        {formatNameProduct(item?.product.name)}
                                    </Col>
                                    <Col xs={3}>sdff</Col>
                                </Col>
                                <Col xs={6} className="row">
                                    <Col xs={4} style={{ textAlign: "center" }}>{formatMoney(item.product.price * (100 - item.product.sale) / 100)} đ</Col>
                                    <Col xs={4} style={{ textAlign: "center" }}>{item.quantity}</Col>
                                    <Col xs={4} style={{ textAlign: "center", color: "#FC5731" }}>{formatMoney(item.product.price * (100 - item.product.sale) / 100 * item.quantity)} đ</Col>
                                </Col>
                            </Row>
                        ))}
                </Container>
            ))}
            <Container style={{ background: "white", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <h5 style={{ margin: 0 }}>
                        Phương thức thanh toán
                    </h5>
                    <div style={{ marginRight: "40px", marginLeft: "40px" }}>
                        <input id="online" type="radio" name="payMethod" value={"online"} checked={payMethod === "online"} onChange={handlePayMethodChange} />
                        <label htmlFor="online">Internet Banking</label>
                    </div>
                    <div>
                        <input id="cod" type="radio" name="payMethod" value={"cod"} checked={payMethod === "cod"} onChange={handlePayMethodChange} />
                        <label htmlFor="cod">Thanh toán khi nhận hàng</label>
                    </div>
                </div>
                <div style={{ marginLeft: "auto", display: "block", textAlign: "right", borderBottom: "solid 1px #E8E7E4" }}>
                    <div>
                        Tổng tiền hàng
                    </div>
                    <h4 style={{ color: "#FC5731" }}>{formatMoney(totalOrder)} đ</h4>
                </div>
                <div style={{ marginLeft: "auto", display: "block", textAlign: "right", marginTop: "10px" }}>
                    <button style={{ padding: "10px 30px", border: "none", background: "#FC5731", color: "white" }}
                        onClick={handleOrder}
                    >Đặt hàng</button>
                </div>
            </Container>
            <br />
            <Footer />
        </div>
    );
};

export default Order;
