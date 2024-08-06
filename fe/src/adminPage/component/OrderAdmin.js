import { Button, Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import formatNameProduct from "../../function/formatNameProduct"
import formatMoney from "../../function/formatMoney"

const OrderAdmin = () => {
    const [orders, setOrders] = useState([])
    const [itemOrder, setItemOrder] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [location])

    const fetchData = async () => {
        try {
            const orderApi = await axios.get("http://localhost:8080/admin/allOrder")
            const searchParams = new URLSearchParams(location.search)
            const filteredOrders = (searchParams.get("statusOrder") === "Tất cả" || searchParams.get("statusOrder") === null) ? orderApi.data.reverse() : orderApi.data.reverse().filter(order => order.status === searchParams.get("statusOrder"))
            setOrders(filteredOrders)

            const itemOrderApi = await axios.get("http://localhost:8080/admin/allOrderItem")
            setItemOrder(itemOrderApi.data)
        } catch (error) {
            console.log(error)
        }
    }

    const indexOfLastOrder = currentPage * itemsPerPage
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)

    // Calculate total pages
    const totalPages = Math.ceil(orders.length / itemsPerPage)

    // Function to change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const handleAction = (status) => {
        switch (status) {
            case 'Chờ xác nhận':
                return (<Col xs={2} >
                    <div style={{ color: "red" }}>
                        <div>{status}</div>
                    </div>
                </Col>)
            case 'Đang chuẩn bị hàng':
                return (<Col xs={2} >
                    <div>
                        <div>{status}</div>
                    </div>

                </Col>)
            default:
                return (<Col xs={2}>
                    <div >
                        <div>{status}</div>
                    </div>
                </Col>)

        }
    }
    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Tất cả đơn hàng</div>
                            {orders.length === 0 ? (<h5 style={{ padding: "20px 0" }}>Chưa có đơn hàng nào</h5>) : (
                                <div>
                                    <Container>
                                        <Row style={{ borderBottom: "2px solid #F5F5F5", padding: "15px 0" }}>
                                            <Col xs={1} style={{ padding: "0" }}>
                                                Người mua
                                            </Col>
                                            <Col xs={2}>
                                                Mã đơn hàng
                                            </Col>
                                            <Col xs={3}>
                                                Sản phẩm
                                            </Col>
                                            <Col xs={2} style={{ textAlign: "end" }}>
                                                Số lượng
                                            </Col>
                                            <Col xs={2} style={{ textAlign: "center" }}>
                                                Đơn giá
                                            </Col>
                                            <Col xs={2} style={{ textAlign: "start" }}>
                                                Trạng thái
                                            </Col>
                                        </Row>
                                    </Container>
                                    {currentOrders.map(order => (
                                        <Row key={order.id} style={{ borderBottom: "solid 3px #F5F5F5", padding: "12px 0  0 0" }}>
                                            <Col xs={1}>
                                                <button style={{ border: "none", background: "none" }} onClick={() => navigate(`/admin/detailAccount?idUser=${order?.user.id}`)}>
                                                    {order?.user.username}
                                                </button>
                                            </Col>
                                            <Col xs={2}>
                                                {order?.code}
                                            </Col>
                                            <Col xs={5}>
                                                {itemOrder
                                                    ?.filter(item => item.order.id === order.id)
                                                    .map(item => (
                                                        <Row key={item.id} style={{ borderBottom: "solid 1px #F5F5F5", padding: "10px 0" }}>
                                                            <Col xs={2}>
                                                                <img style={{ width: "100%" }} src={`${item?.product.image[0]}`} alt="imgproduct" />
                                                            </Col>
                                                            <Col xs={8}>
                                                                {formatNameProduct(item?.product.name)}
                                                            </Col>
                                                            <Col xs={2} style={{ textAlign: "center" }}>
                                                                x {item?.quantity}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                            </Col>
                                            <Col xs={2} style={{ display: "flex", justifyContent: "center" }}>
                                                {formatMoney(order?.totalOrder)} đ
                                            </Col>

                                            {handleAction(order?.status)}

                                        </Row>
                                    ))}
                                    {/* Pagination Controls */}
                                    <Row style={{ marginTop: "20px", paddingBottom: "15px" }}>
                                        <Col style={{ display: "flex", justifyContent: "center" }}>
                                            <Button
                                                variant="secondary"
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                style={{ marginRight: "10px" }}
                                            >
                                                {'<'}
                                            </Button>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <Button
                                                    key={i}
                                                    variant="primary"
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    style={{
                                                        margin: "0 5px",
                                                        backgroundColor: currentPage === i + 1 ? "#F75530" : "white",
                                                        color: currentPage === i + 1 ? "white" : "black",
                                                        border: currentPage === i + 1 ? "none" : "1px solid #ccc"
                                                    }}
                                                >
                                                    {i + 1}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="secondary"
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={indexOfLastOrder >= orders.length}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                {'>'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Container>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    )
}
export default OrderAdmin