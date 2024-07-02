import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState([])
    const navigate = useNavigate()
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

    const viewDetailProduct = (id) => {
        navigate(`/product/${id}`)
    }
    const truncateString = (str) => {
        if (!str || str.length <= 44) {
            return str;
        }
        return str.substring(0, 44) + "...";
    };
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };
    return (
        <Container style={{ backgroundColor: "white" }}>
            <Row>
                <h5 style={{ color: "#A17575" }}>Bán chạy nhất</h5>
                {bestSeller.map(product => (
                    <Col xs={2} key={product.idProduct} onClick={() => viewDetailProduct(product.idProduct)}>
                        <img
                            src={`../images/product/${product.image}`}
                            alt={product.name}
                            style={{ maxWidth: "100%", }}
                        />
                        <div>
                            <div style={{ background: "white", padding: "10px" }}>
                                <div>{truncateString(product?.name)}</div>
                            </div>
                            <div style={{ marginBottom: "0", paddingBottom: "10px", backgroundColor: "#fff" }}>
                                <div style={{ display: "flex", marginTop: "10px", justifyContent: "space-between" }}>
                                    <div style={{ color: "#EE4D2D" }}>{formatNumber(product?.price)} đ</div>
                                    <div>Đã bán {product?.numberOfSale}</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container >
    )
}
export default BestSeller