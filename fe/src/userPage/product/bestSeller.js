import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { viewProductDetail } from "../../redux/Slice/product"
import formatMoney from "../../function/formatMoney"
import truncateString from "../../function/formatNameProduct"

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const bestSellerApi = await axios.get("http://localhost:8080/bestseller")
                setBestSeller(bestSellerApi.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [])

    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product))
        localStorage.setItem("item", JSON.stringify(product))
        navigate(`/product/${product.idProduct}`)
    }


    return (
        <Container style={{ backgroundColor: "white" }}>
            <Row>
                <h5 style={{ color: "#A17575" }}>Bán chạy nhất</h5>
                {bestSeller.map(product => (
                    <Col xs={2} key={product.idProduct} onClick={() => viewDetailProduct(product)}>
                        <img
                            src={`${product.image[0]}`}
                            alt={product.name}
                            style={{ maxWidth: "100%", }}
                        />
                        <div>
                            <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                {truncateString(product?.name)}
                            </div>
                            <div>
                                {product?.sale === 0 ? (
                                    <div>
                                        <div style={{ color: "#EE4D2D" }}>
                                            {formatMoney(product.price)} đ
                                        </div>
                                        <div style={{ color: "white", fontSize: "8px" }}>asds</div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ fontSize: "12px", textDecoration: "line-through" }}>
                                                {formatMoney(product.price)} đ
                                            </div>
                                            <div style={{ background: "#F84A2F", color: "white", fontSize: "12px", padding: "0 2px" }}>Giảm {product?.sale}%</div>
                                        </div>
                                        <div style={{ color: "#EE4D2D", fontSize: "15px" }}>
                                            {formatMoney(Math.ceil(product?.price * (100 - product?.sale) / 100))} đ
                                        </div>
                                    </div>
                                )}
                                <div>Đã bán {product?.numberOfSale}</div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container >
    )
}
export default BestSeller