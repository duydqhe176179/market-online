import { Col, Container, Row } from "react-bootstrap"
import Header from "./Header"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react";
import axios from "axios"
import Footer from "./Footer";

export default function Home() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const [category, setCategory] = useState([])
    const [bestSeller, setBestSeller] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryApi = await axios.get("http://localhost:8080/category")
                setCategory(categoryApi.data)

                const bestSellerApi = await axios.get("http://localhost:8080/bestseller")
                setBestSeller(bestSellerApi.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [])

    return (
        <div style={{ backgroundColor: "#F5F5F5" }}>
            <Header />
            <br /><br />
            <Container style={{ backgroundColor: "white" }}>
                <Slider {...settings}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src="../images/banner-1.jpg" alt="Slide 1" />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src="../images/banner-2.jpg" alt="Slide 2" />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img src="../images/banner-3.png" alt="Slide 3" />
                    </div>
                </Slider>
            </Container>
            <br />
            <Container style={{ backgroundColor: "white" }}>

                <Row>
                    <h5 style={{ color: "#A17575" }}>Danh mục</h5>
                    {category.map(category => (
                        <Col key={category.id} xs={1}>
                            <img src={`../images/category/${category.image}`} style={{ height: "100px", width: "100px" }} alt="..." />
                            <div style={{ textAlign: "center" }}>{category.name}</div>
                        </Col>
                    ))}
                </Row>
                <br />
            </Container>
            <br />
            <Container style={{ backgroundColor: "white" }}>
                <Row>
                    <h5 style={{ color: "#A17575" }}>Bán chạy nhất</h5>
                    {bestSeller.map(product => (
                        <Col xs={2} key={product.idProduct}>
                            <img 
                            src={`../images/product/${product.image}`} 
                            alt={product.name}
                            style={{width:"200px",height:"200px"}}
                            />
                            <div>{product.name}</div>
                        </Col>
                    ))}
                </Row>
            </Container>
            <br />
            <Footer />
        </div>
    )
}