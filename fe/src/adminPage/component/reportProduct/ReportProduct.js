import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row, Table } from "react-bootstrap"
import formatDate from "../../../function/formatDate"
import { useNavigate } from "react-router-dom"
import { message, Modal } from "antd"
import TextArea from "antd/es/input/TextArea"
import { REJECT_REPORT } from "../../../constant/constant"

const ReportProduct = () => {
    const [reportProduct, setReportProduct] = useState()
    const navigate = useNavigate()
    const [openRejectReport, setOpenRejectReport] = useState(false)
    const [reasonReject, setReasonReject] = useState('')
    const [idReport, setIdReport] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const reportProductApi = await axios.get("http://localhost:8080/admin/allReportProduct")
            setReportProduct(reportProductApi.data)
            console.log(reportProductApi.data)

        } catch (error) {
            console.log(error);
        }
    }

    const handleOk = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:8080/admin/rejectReportProduct?idReport=${idReport}&reasonReject=${reasonReject}`)
            if (response.status === 200) {
                message.success("Đã từ chối")
            }
            fetchData()
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi")
        }
        setOpenRejectReport(false)
    }

    return (
        <Container>
            <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Sản phẩm bị tố cáo</div>
                <Table style={{ width: "100%" }} striped bordered hover>
                    <tbody>
                        <tr>
                            <td>Sản phẩm bị báo cáo</td>
                            <td>Tiêu đề</td>
                            <td>Nội dung</td>
                            <td>Ngày gửi</td>
                            <td style={{ textAlign: "center" }}>Xử lý</td>
                            <td>Người gửi</td>
                        </tr>
                        {reportProduct
                            ?.filter(report => report.status === "Đang chờ xử lý")
                            ?.map(report => (
                                <tr key={report?.id} style={{ height: "100px" }}>
                                    <td style={{ width: "470px" }}>
                                        <Row>
                                            <Col xs={2}>
                                                <button style={{ border: "none", background: "none" }} onClick={() => navigate(`/product/${report?.product.idProduct}`)}>
                                                    <img src={report?.product.image[0]} alt="img product" style={{ width: "60px", height: "auto" }} />
                                                </button>
                                            </Col>
                                            <Col xs={10} style={{ display: "flex", alignItems: "center" }} >
                                                <button onClick={() => navigate(`/product/${report?.product.idProduct}`)} style={{ border: "none", background: "none", textAlign: "start" }}>
                                                    <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>{report?.product.name}</div>
                                                </button>
                                            </Col>
                                        </Row>
                                    </td>
                                    <td>{report?.title}</td>
                                    <td>{report?.content}</td>
                                    <td>{formatDate(report?.dateSend)}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button style={{ border: "1px solid black", borderRadius: "5px", width: "50px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                Khóa
                                            </button>
                                            <button onClick={() => {
                                                setIdReport(report?.id)
                                                setOpenRejectReport(true)
                                            }} style={{ border: "none", background: "none", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                Bỏ qua
                                            </button>
                                        </div>
                                    </td>

                                    <td>{report?.accuser.name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>

                <Modal
                    title="Báo cáo này không được duyệt"
                    open={openRejectReport}
                    onOk={handleOk}
                    onCancel={() => setOpenRejectReport(false)}
                >

                    <div>Lý do:  </div>
                    <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={reasonReject} onChange={e => setReasonReject(e.target.value)}></TextArea>
                </Modal>
            </Container>
            <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Tố cáo đã xử lý</div>
                <Table style={{ width: "100%" }} striped bordered hover>
                    <tbody>
                        <tr>
                            <td>Sản phẩm bị báo cáo</td>
                            <td>Tiêu đề</td>
                            <td>Nội dung</td>
                            <td>Ngày gửi</td>
                            <td >Trạng thái</td>
                            <td>Lý do</td>
                            <td>Người gửi</td>
                        </tr>
                        {reportProduct
                            ?.filter(report => report.status !== "Đang chờ xử lý")
                            ?.map(report => (
                                <tr key={report?.id} style={{ height: "100px" }}>
                                    <td style={{ width: "470px" }}>
                                        <Row>
                                            <Col xs={2}>
                                                <button style={{ border: "none", background: "none" }} onClick={() => navigate(`/product/${report?.product.idProduct}`)}>
                                                    <img src={report?.product.image[0]} alt="img product" style={{ width: "60px", height: "auto" }} />
                                                </button>
                                            </Col>
                                            <Col xs={10} style={{ display: "flex", alignItems: "center" }} >
                                                <button onClick={() => navigate(`/product/${report?.product.idProduct}`)} style={{ border: "none", background: "none", textAlign: "start" }}>
                                                    <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>{report?.product.name}</div>
                                                </button>
                                            </Col>
                                        </Row>
                                    </td>
                                    <td>{report?.title}</td>
                                    <td>{report?.content}</td>
                                    <td>{formatDate(report?.dateSend)}</td>
                                    <td>{report?.status === REJECT_REPORT ? (
                                        <div style={{ color: "red" }}>{report?.status}</div>
                                    ) : (
                                        <div style={{ color: "green" }}>{report?.status}</div>
                                    )}
                                    </td>
                                    <td>{report?.reasonReject}</td>
                                    <td>{report?.accuser.name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Container>
        </Container>
    )
}
export default ReportProduct