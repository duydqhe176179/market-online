import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const OtherProduct = ({ shop, idProduct }) => {
    const [allProduct, setAllProduct] = useState([])
    const navigate=useNavigate()
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

    const truncateString = (str) => {
        if (!str || str.length <= 44) {
            return str;
        }
        return str.substring(0, 44) + "...";
    };
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };
    const productStyle = {
        padding: "5px",
    }

    return (
        <Container>
            <div>CÁC SẢN PHẨM KHÁC CỦA SHOP</div>
            <br/>
            <Row>
                {allProduct.filter(product => product.idProduct !== idProduct)
                    .map(product => (
                        <Col key={product.idProduct} xs={2} style={productStyle} onClick={()=>navigate(`/product/${product.idProduct}`)}>
                            <img
                                src={`../images/product/${product.image}`}
                                alt={product.name}
                                style={{ maxWidth: "100%", }} />
                            <div style={{ background: "white", padding: "10px" }}>
                                <div>{truncateString(product?.name)}</div>
                                <div style={{display:"flex",marginTop: "10px",justifyContent:"space-between"}}>
                                    <div style={{ color: "#EE4D2D" }}>{formatNumber(product?.price)} đ</div>
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