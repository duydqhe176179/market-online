import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap"
import { AiOutlineShop } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ShopInfo = ({ idShop }) => {
    const [shop, setShop] = useState()
    const [averageStar, setAverageStar] = useState()
    const [allRate, setAllRate] = useState()
    const [allProduct, setAllProduct] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const shopApi = await axios.get(`http://localhost:8080/shop/${idShop}`)
                setShop(shopApi.data.shop)
                setAllRate(shopApi.data.allRate)
                setAllProduct(shopApi.data.products)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [idShop])
    const navigate = useNavigate()

    useEffect(() => {
        const totalStar = allRate?.reduce((total, star) => total + star.star, 0)
        setAverageStar((totalStar / allRate?.length).toFixed(1))
    }, [allRate])

    return (
        <Container style={{ background: "white", padding: "15px 0 15px 40px" }}>
            <Row>
                <Col xs={4} style={{ borderRight: "solid 1px #FAE3E1" }}>
                    <Row>
                        <Col xs={4} style={{ borderRadius: "50%", overflow: "hidden", width: "100px", height: "100px", padding: "0" }}>
                            <img src={`../images/avatar/${shop?.avatar}`} alt="avatar" width={"100%"}
                                style={{
                                    objectFit: "cover",
                                    height: "100%"
                                }} />
                        </Col>
                        <Col style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                        }}>
                            <div style={{ fontWeight: "" }}>{shop?.name}</div>
                            <button onClick={() => navigate(`/shop/${shop?.id}`)} style={{
                                background: "#EDDCBE",
                                border: "solid 1px #FC5731",
                                padding: "5px 15px",
                                color: "#FC5731",
                                width: "125px"
                            }}><AiOutlineShop /> Xem Shop</button>
                        </Col>
                    </Row>
                </Col>
                <Col xs={8} style={{flexDirection:"column",alignItems:"center"}}>
                    <Row style={{ alignItems: "center" ,textAlign:"center"}}>
                        <Col xs={3}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: 'center'
                            }}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        style={{ color: i < Math.round(averageStar) ? "#F0D24A" : "#e4e5e9", fontSize: "20px" }}
                                    />
                                ))}
                            </div>
                        </Col>
                        <Col xs={3}>
                            <span>Đánh giá:</span>
                            <span style={{ fontSize: "25px", marginLeft: "15px", color: "red" }}>{averageStar}</span>
                        </Col>
                        <Col xs={3}>Tham gia vào: <span style={{ color: "red" }}>{moment().diff(shop?.dateSignup, 'years')}  năm trước</span></Col>
                        <Col xs={3}>Sản phẩm: <span style={{color:"red"}}>{allProduct?.length }</span></Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
export default ShopInfo