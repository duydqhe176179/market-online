import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { viewProductDetail } from "../../redux/Slice/product"
import formatMoney from "../../function/formatMoney"
import truncateString from "../../function/formatNameProduct"

const OtherProduct = ({ shop, idProduct }) => {
    const [allProduct, setAllProduct] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allProductApi = await axios.get(`http://localhost:8080/product/shop/${shop?.id}`)
                setAllProduct(allProductApi.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [shop?.id])

    
    const productStyle = {
        padding: "5px",
    }
    const viewDetailProduct = (product) => {
        localStorage.setItem("item", JSON.stringify(product))
        navigate(`/product/${product.idProduct}`)
    }
    return (
        <Container>
            <div>CÁC SẢN PHẨM KHÁC CỦA SHOP</div>
            <br />
            <Row>
                {allProduct.filter(product => product.idProduct !== idProduct)
                    .map(product => (
                        <Col key={product.idProduct} xs={2} style={productStyle} onClick={() => viewDetailProduct(product)}>
                            <img
                                src={`${product.image[0]}`}
                                alt={product.name}
                                style={{ maxWidth: "100%", }} />
                            <div style={{ background: "white", padding: "10px" }}>
                                <div>{truncateString(product?.name)}</div>
                                <div style={{ display: "flex", marginTop: "10px", justifyContent: "space-between" }}>
                                    <div style={{ color: "#EE4D2D" }}>{formatMoney(product?.price)} đ</div>
                                    <div>Đã bán {product?.numberOfSale}</div>
                                </div>
                            </div>
                        </Col>
                    ))}
            </Row>
        </Container>
    )
}
export default OtherProduct