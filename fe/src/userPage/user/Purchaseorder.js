import { Col, Container, Row } from "react-bootstrap"
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { AiOutlineShop } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import formatMoney from "../../function/formatMoney";
import { useDispatch } from "react-redux";
import { viewProductDetail } from "../../redux/Slice/product";
import { Modal, Rate } from "antd";
import { CANCEL, COMPLETED, PREPARING_ORDER, SHIPPING, WAIT_FOR_CONFIRM_ORDER } from "../../constant/constant";
import TextArea from "antd/es/input/TextArea";

const PurchaseOrder = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState()
    const [allItem, setAllItem] = useState()
    const [openRate, setOpenRate] = useState(false)
    const [idProductRate, setIdProductRate] = useState()
    const [idItemRate, setIdItemRate] = useState()
    const [star, setStar] = useState(1)
    const [review, setReview] = useState()
    const [filterStatus, setFilterStatus] = useState("Tất cả")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        setUser(userLocal);
        fetchData(userLocal.id)
    }, [user?.id]);

    const fetchData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/order?idUser=${userId}`)
            setOrders(response.data.map((order) => ({
                ...order
            }))
                .reverse());

            const listItemApi = await axios.get(`http://localhost:8080/orderItems?idUser=${userId}`)
            setAllItem(listItemApi.data.map((item) => ({
                ...item
            }))
                .reverse())
        } catch (error) {
            console.log(error);
        }
    }

    const checkQuantityOfItemOfOrder = (idOrder) => {
        const listItemOfOrder = allItem?.filter(item => item.order.id === idOrder)
        return listItemOfOrder?.length
    }
    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product))
        localStorage.setItem("item", JSON.stringify(product))
        navigate(`/product/${product.idProduct}`)
    }
    const buttonFilterStyle = {
        border: "none",
        background: "white",
        padding: "15px 0",
        borderRight: "solid 1px black"
    }



    const changeStatusOrder = async (idOrder, status) => {
        try {
            const response = await axios.post(`http://localhost:8080/shop/changeStatusOrder?idOrder=${idOrder}&status=${status}`)
            console.log(response.data);
            fetchData(user?.id)
        } catch (error) {
            console.log(error);
        }
    }

    const showRateForm = (idProduct, idItem) => {
        setIdProductRate(idProduct)
        setIdItemRate(idItem)
        setOpenRate(true)
    }
    const handleOk = async (e) => {
        e.preventDefault()
        console.log(star);
        console.log(review);
        const rate = {
            idProduct: idProductRate,
            idUser: user.id,
            idOrderItem: idItemRate,
            star: star,
            review: review
        }
        try {
            const response = await axios.post("http://localhost:8080/rateProduct", rate)
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

        setOpenRate(false);
    };

    const handleCancel = () => {
        setOpenRate(false);
    };


    return (
        <div style={{ background: "#F5F5F5" }}>


            <Row style={{ background: "white", margin: "0 0 10px 0" }}>
                <button onClick={() => setFilterStatus("Tất cả")} className="col-2" style={buttonFilterStyle}>Tất cả</button>
                <button onClick={() => setFilterStatus(WAIT_FOR_CONFIRM_ORDER)} className="col-2" style={buttonFilterStyle}>Chờ xác nhận</button>
                <button onClick={() => setFilterStatus(PREPARING_ORDER)} className="col-2" style={buttonFilterStyle}>Đang chuẩn bị hàng</button>
                <button onClick={() => setFilterStatus(SHIPPING)} className="col-2" style={buttonFilterStyle}>Đang vận chuyển</button>
                <button onClick={() => setFilterStatus(COMPLETED)} className="col-2" style={buttonFilterStyle}>Hoàn thành</button>
                <button onClick={() => setFilterStatus(CANCEL)} className="col-2" style={buttonFilterStyle}>Đã hủy</button>
            </Row>
            <div style={{ background: "#EAEAEA" }}>
                <CiSearch style={{ width: "35px", height: "auto", padding: "5px" }} />
                <input style={{ width: "96%", background: "#EAEAEA", border: "none", padding: "10px 0" }} placeholder="Nhập mã đơn hàng để tìm kiếm" />
            </div>
            <div style={{ margin: "10px 0 15px 0" }}>
                {orders
                    ?.filter(order => 
                        filterStatus === "Tất cả" || order?.status === filterStatus
                    )
                    ?.map(order => (
                        <div key={order?.id} style={{ marginBottom: "20px", background: "white", borderRadius: "10px" }}>
                            {checkQuantityOfItemOfOrder(order.id) === 1 ? (
                                <div>
                                    {allItem?.map(item =>
                                        item.order.id === order.id ? (
                                            <Container key={item.id}>
                                                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #7F7F7F" }}>
                                                    <div style={{ display: "flex", padding: "10px 0" }}>
                                                        <h5 >{item?.product.shop.name}</h5>
                                                        <button onClick={() => navigate(`/shop/${item?.product.shop.id}`)} style={{
                                                            background: "white",
                                                            border: "solid 1px #E8E8E8",
                                                            marginLeft: "20px"
                                                        }}><AiOutlineShop /> Xem Shop</button>
                                                    </div>
                                                    {order?.status === "Hoàn thành" ? (
                                                        <div style={{ display: "flex" }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                {order?.status}
                                                            </div>
                                                            <button onClick={() => showRateForm(item?.product.idProduct, item?.id)} style={{ color: "#EE4D2D", border: "none", background: "none" }}>Đánh giá</button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: "red" }}>
                                                                {order?.status}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <Row style={{ marginTop: "10px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                                                    <Col xs={2}>
                                                        <img src={`${item?.product.image[0]}`}
                                                            alt="imgPro"
                                                            style={{ width: "100%" }}
                                                        />
                                                    </Col>
                                                    <Col xs={8}>
                                                        <div style={{ fontSize: "18px" }}>{item?.product.name}</div>
                                                        <div>x {item?.quantity}</div>
                                                    </Col>
                                                    <Col xs={2}>
                                                        {item?.product.sale ? (
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                <div style={{ fontSize: "15px", textDecoration: "line-through", color: "#7F7F7F", marginRight: "5px" }}>{formatMoney(item?.product.price * item?.quantity)} đ</div>
                                                                <div style={{ fontSize: "15px", color: "#EE4D2D" }}>{formatMoney(item?.product.price * item?.quantity * (100 - item?.product.sale) / 100)} đ</div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ color: "#EE4D2D", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                {formatMoney(item?.product.price)} đ
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                                <div style={{ textAlign: "end", padding: "50px 0 20px 0" }}>
                                                    <div>Thành tiền: <span style={{ fontSize: "22px", color: "#EE4D2D" }}>{formatMoney(order?.totalOrder)}</span> đ</div>
                                                    <div>{(() => {
                                                        if (order?.status === "Hoàn thành" || order?.status === "Đã hủy") {
                                                            return <button
                                                                onClick={() => viewDetailProduct(item?.product)}
                                                                style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                            >Mua lại</button>;
                                                        } else if (order?.status === "Đang vận chuyển") {
                                                            return <button onClick={() => changeStatusOrder(order?.id, order?.status)}
                                                                style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                            >Đã nhận được hàng</button>;
                                                        } else {
                                                            return <button disabled
                                                                style={{ background: "#6C6C6C", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                            >Đã nhận được hàng</button>;
                                                        }
                                                    })()}
                                                        <button style={{ background: "white", border: "solid 1px #6C6C6C", width: "150px", padding: "10px 0", borderRadius: "5px", marginLeft: "10px" }}
                                                        >Chat với người bán</button>
                                                    </div>
                                                </div>
                                            </Container>
                                        ) : null
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {allItem?.map(item =>
                                        item.order.id === order.id ? (
                                            <Container key={item.id}>
                                                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #7F7F7F" }}>
                                                    <div style={{ display: "flex", padding: "10px 0" }}>
                                                        <h5 >{item?.product.shop.name}</h5>
                                                        <button onClick={() => navigate(`/shop/${item?.product.shop.id}`)} style={{
                                                            background: "white",
                                                            border: "solid 1px #E8E8E8",
                                                            marginLeft: "20px"
                                                        }}><AiOutlineShop /> Xem Shop</button>
                                                    </div>
                                                    {order?.status === "Hoàn thành" ? (
                                                        <div style={{ display: "flex" }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginRight: "20px" }}>
                                                                {order?.status}
                                                            </div>
                                                            <button onClick={() => showRateForm(item?.product.idProduct, item?.id)} style={{ color: "#EE4D2D", border: "none", background: "none" }}>Đánh giá</button>

                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: "red" }}>
                                                                {order?.status}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <Row style={{ marginTop: "10px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                                                    <Col xs={2}>
                                                        <img src={`${item?.product.image[0]}`}
                                                            alt="imgPro"
                                                            style={{ width: "100%" }}
                                                        />
                                                    </Col>
                                                    <Col xs={8}>
                                                        <div style={{ fontSize: "18px" }}>{item?.product.name}</div>
                                                        <div>x {item?.quantity}</div>
                                                    </Col>
                                                    <Col xs={2}>
                                                        {item?.product.sale ? (
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                <div style={{ fontSize: "15px", textDecoration: "line-through", color: "#7F7F7F", marginRight: "5px" }}>{formatMoney(item?.product.price * item?.quantity)} đ</div>
                                                                <div style={{ fontSize: "15px", color: "#EE4D2D" }}>{formatMoney(item?.product.price * item?.quantity * (100 - item?.product.sale) / 100)} đ</div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ color: "#EE4D2D", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                {formatMoney(item?.product.price)} đ
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                            </Container>
                                        ) : null
                                    )}
                                    <Container>
                                        <div style={{ textAlign: "end", padding: "50px 0 20px 0" }}>
                                            <div>Thành tiền: <span style={{ fontSize: "22px", color: "#EE4D2D" }}>{formatMoney(order?.totalOrder)}</span> đ</div>
                                            <div>{(() => {
                                                if (order?.status === "Hoàn thành" || order?.status === "Đã hủy") {
                                                    return <button
                                                        onClick={() => viewDetailProduct(allItem.filter(item => item.order.id === order.id)[0].product)}
                                                        style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                    >Mua lại</button>;
                                                } else if (order?.status === "Đang vận chuyển") {
                                                    return <button onClick={() => changeStatusOrder(order?.id, order?.status)}
                                                        style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                    >Đã nhận được hàng</button>;
                                                } else {
                                                    return <button disabled
                                                        style={{ background: "#6C6C6C", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                    >Đã nhận được hàng</button>;
                                                }
                                            })()}
                                                <button style={{ background: "white", border: "solid 1px #6C6C6C", width: "150px", padding: "10px 0", borderRadius: "5px", marginLeft: "10px" }}
                                                >Chat với người bán</button>
                                            </div>
                                        </div>
                                    </Container>
                                </div>
                            )}

                        </div>
                    ))}

            </div>

            <Modal
                title="Phiếu đánh giá"
                open={openRate}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Rate style={{ fontSize: "30px" }} onChange={setStar} value={star} />
                <div>Cảm nhận của bạn về sản phẩm thế nào ? </div>
                <TextArea style={{ width: "100%", height: "100px",marginTop:"10px" }} value={review} onChange={e => setReview(e.target.value)}></TextArea>
            </Modal>

        </div>
    )
}
export default PurchaseOrder