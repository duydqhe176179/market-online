import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useParams } from "react-router-dom"
import { FaStar } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { FaDropbox } from "react-icons/fa";
import { FaShippingFast } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import ShopInfo from "../shop/ShopInfo"
import Footer from "../Footer"
import DescriptionProduct from "./description"
import ReviewProduct from "./reviewProduct"
import OtherProduct from "./otherProduct"

const DetailProduct = () => {
    const [product, setProduct] = useState()
    const { id } = useParams()
    const [rateProduct, setRateProduct] = useState([])
    const [averageStar, setAverageStar] = useState()
    const [quantity, setQuantity] = useState(1)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productApi = await axios.get(`http://localhost:8080/product/${id}`)
                setProduct(productApi.data)

                const rateProductApi = await axios.get(`http://localhost:8080/product/rate/${id}`)
                setRateProduct(rateProductApi.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        const totalStar = rateProduct?.reduce((total, star) => total + star.star, 0)
        setAverageStar((totalStar / rateProduct?.length).toFixed(1))
    }, [rateProduct])

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);


    const styleRating = {
        display: "flex", border: "none", background: "white", alignItems: "center",
        justifyContent: 'center', paddingRight: "20px"
    }
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        width: '100px',
        marginLeft: "40px"
    };

    const buttonStyle = {
        width: '30px',
        height: '30px',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: "white",
        cursor: 'pointer',
    };

    const quantityStyle = {
        fontSize: '20px',
        width: '60px',
        textAlign: 'center',
        border: "1px solid #DBD9DB"
    };

    const labelText = {
        marginLeft: "25px",
        textAlign: "center",
        padding: "5px",
    }
    const buyButton = {
        marginLeft: "20px",
        border: "none",
        padding: "10px",
        width: "200px"
    }
    return (
        <div style={{ backgroundColor: "#F5F5F5" }}>
            <Header />
            <br />
            <Container style={{ backgroundColor: "white" }}>
                <Row>
                    <Col xs={4} style={{ padding: "5px" }}>
                        <img src={`../images/product/${product?.image}`} alt="img"
                            style={{
                                width: "100%",
                                padding: "5px"
                            }}
                        />
                    </Col>
                    <Col xs={8} style={{ padding: "10px 10px 10px 20px" }}>
                        <div style={{ fontSize: "20px" }}>{product?.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex" }}>
                                {rateProduct?.length > 0 ?
                                    (<div>
                                        <button style={styleRating}>
                                            <div style={{ marginRight: "8px" }}>{averageStar}</div>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: 'center'
                                            }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        style={{ color: i < averageStar ? "#F0D24A" : "#e4e5e9" }}
                                                    />
                                                ))}
                                            </div>
                                        </button>
                                        <button style={styleRating}>{rateProduct.length}  <div style={{ marginLeft: "10px" }}>Đánh giá</div></button>
                                    </div>)
                                    : (
                                        <div style={{marginRight:"30px",borderRight:"solid 1px #999999",paddingRight:"40px"}}>Chưa có đánh giá</div>
                                    )}
                                <div style={styleRating}>{product?.numberOfSale}  <div style={{ marginLeft: "10px" }}>Đã bán</div></div>
                            </div>
                            <button style={{ ...styleRating, color: "#DBAC95", display: "flex", justifyContent: "flex-end", marginLeft: "10px" }}>Tố cáo</button>
                        </div>
                        <div style={{ display: "flex", marginTop: "20px", background: "#FAFAFA", padding: "20px 0 20px 20px", }}>
                            {product?.sale === 0 ?
                                (<div>
                                    <h2 style={{ color: "#DB4343" }}>{formatNumber(product?.price)} đ</h2>
                                </div>) :
                                (<div style={{ display: "flex" }}>
                                    <h4 style={{ padding: "5px", color: "#DBAC95", textDecoration: "line-through", marginRight: "20px" }}>{formatNumber(product?.price)} đ</h4>
                                    <h2 style={{ color: "#DB4343" }}>{formatNumber((product?.price) / 100 * (100 - product?.sale))} đ</h2>
                                    <h6 style={{ padding: '10px 0 10px 0', marginLeft: "15px" }}>Giảm {product?.sale}%</h6>
                                </div>
                                )}
                        </div>
                        <br /><br />
                        <div style={{ display: "flex" }}>
                            <div style={labelText}>
                                Số Lượng
                            </div>
                            <div style={containerStyle}>
                                <button onClick={() => setQuantity(quantity => quantity - 1)} style={buttonStyle}>-</button>
                                <span style={quantityStyle}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity => quantity + 1)} style={buttonStyle}>+</button>
                            </div>
                            <div style={{ ...labelText, color: "#DB2121" }}>
                                Còn lại: {product?.remain}
                            </div>
                        </div>
                        <br /><br />
                        <div>
                            <button style={{ ...buyButton, color: "#FC5731", border: "#FC5731 solid 1px" }}>
                                <BsCartCheck />  Thêm vào giỏ hàng
                            </button>
                            <button style={{ ...buyButton, color: "white", background: "#FC5731" }}>
                                Mua ngay
                            </button>
                        </div>
                        <br /><br />
                        <Row style={{ marginLeft: "5px", paddingTop: "20px", borderTop: "solid 1px #e4e5e9" }}>
                            <Col xs={4}><FaDropbox style={{ color: "#FC5731" }} /> Giao hàng nhanh chóng</Col>
                            <Col xs={4}><FaShippingFast style={{ color: "#FC5731" }} /> Miễn phí vận chuyển</Col>
                            <Col xs={4}><RxReset style={{ color: "#FC5731" }} /> Miễn phí hoàn hàng 15 ngày</Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <br />
            <ShopInfo idShop={product?.shop.id} />
            <br />
            <DescriptionProduct product={product} />
            <br />
            <ReviewProduct rateProduct={rateProduct} />
            <br />
            <OtherProduct shop={product?.shop} idProduct={product?.idProduct} />
            <br />
            <Footer />
        </div>
    )
}
export default DetailProduct