import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { viewProductDetail } from "../../redux/Slice/product"
import truncateString from "../../function/formatNameProduct"
import formatNumber from "../../function/formatMoney"
import { FaCheck } from "react-icons/fa";
import { MdDisabledByDefault } from "react-icons/md";
import AllProduct from "../../userPage/shop/allProduct"
import { message, Modal } from "antd"
import TextArea from "antd/es/input/TextArea"

const ProductAdmin = () => {
    const [product, setproduct] = useState()
    const [ressonReject, setReasonReject] = useState()
    const [idProductReject, setIdProductReject] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [openReasonReject, setOpenReasonReject] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const productApi = await axios.get("http://localhost:8080/products")
            setproduct(productApi.data)
        } catch (error) {
            console.log(error);
        }
    }
    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product));
        localStorage.setItem("item", JSON.stringify(product));
        navigate(`/product/${product.idProduct}`);
    };

    const agreeProduct = async (idProduct) => {
        try {
            const response = await axios.post(`http://localhost:8080/admin/agreeProduct?idProduct=${idProduct}`)
            if (response.status === 200) {
                message.success("Hoàn thành")
            }
            fetchData()
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi")
        }
    }

    const disAgreeProduct = async (idProduct) => {
        setOpenReasonReject(true)
        setIdProductReject(idProduct)
    }
    const handleOk = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:8080/admin/rejectProduct?idProduct=${idProductReject}&reasonReject=${ressonReject}`)
            console.log(response.data);
            if (response.status === 200) {
                message.success("Đã từ chối")
            }
            fetchData()
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi")
        }

        setOpenReasonReject(false);
    };
    const handleCancel = () => {
        setOpenReasonReject(false);
    };

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10} style={{ paddingRight: "30px" }}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Sản phẩm đợi duyệt</div>
                            <Row>
                                {product
                                    ?.filter(product => product.status === "Đang chờ duyệt")
                                    ?.map(product => (
                                        <Col key={product.idProduct} xs={2} style={{ background: "white", padding: "5px", border: "1px solid #F5F5F5", borderRadius: "10px" }}>
                                            <div style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #F5F5F7" }}
                                                onClick={() => viewDetailProduct(product)}>
                                                <img
                                                    src={`${product.image[0]}`}
                                                    alt={product.name}
                                                    style={{ maxWidth: "100%" }}
                                                />
                                                <div>
                                                    <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                                        {truncateString(product?.name)}
                                                    </div>
                                                    <div>
                                                        {product?.sale === 0 ? (
                                                            <div>
                                                                <div style={{ color: "#EE4D2D" }}>
                                                                    {formatNumber(product.price)} đ
                                                                </div>
                                                                <div style={{ color: "white", fontSize: "8px" }}>asds</div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                <div>
                                                                    <div style={{ fontSize: "12px", textDecoration: "line-through" }}>
                                                                        {formatNumber(product.price)} đ
                                                                    </div>
                                                                    <div style={{ background: "#F84A2F", color: "white", fontSize: "12px", padding: "0 2px" }}>Giảm {product?.sale}%</div>
                                                                </div>
                                                                <div style={{ color: "#EE4D2D", fontSize: "15px" }}>
                                                                    {formatNumber(Math.ceil(product?.price * (100 - product?.sale) / 100))} đ
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-evenly", fontSize: "20px", padding: "5px 0" }}>
                                                <button onClick={() => agreeProduct(product?.idProduct)} style={{ border: "none", background: "none", width: "50%" }}>
                                                    <FaCheck style={{ color: "green" }} />
                                                </button>
                                                |
                                                <button onClick={() => disAgreeProduct(product?.idProduct)} style={{ border: "none", background: "none", width: "50%" }}>
                                                    <MdDisabledByDefault style={{ color: "red" }} />
                                                </button>

                                            </div>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </Container>
                        <br />
                        <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D", background: "#F5F5F5" }}>Tất cả sản phẩm</div>
                        <AllProduct allProduct={product} status="ok" style />
                        <br />
                        <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D", background: "#F5F5F5" }}>Sản phẩm đã từ chối</div>
                        <AllProduct allProduct={product} status="Từ chối" style />
                        <br />
                        <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D", background: "#F5F5F5" }}>Sản phẩm đang bị khóa</div>
                        <AllProduct allProduct={product} status="Cấm" style />
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
            <Modal
                title="Bạn đã từ chối sản phẩm này"
                open={openReasonReject}
                onOk={handleOk}
                onCancel={handleCancel}
            >

                <div>Lý do:  </div>
                <TextArea style={{ width: "100%", height: "100px",marginTop:"10px" }} value={ressonReject} onChange={e => setReasonReject(e.target.value)}></TextArea>
            </Modal>
        </div>
    )
}
export default ProductAdmin