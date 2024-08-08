import { Col, Container, Row, Table } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import axios from "axios"
import { Avatar, message, Modal, Select } from "antd"
import { useNavigate } from "react-router-dom"
import formatDate from "../../function/formatDate"
import TextArea from "antd/es/input/TextArea"
import ReportProduct from "./reportProduct/ReportProduct"
import { REJECT_REPORT } from "../../constant/constant"

const ReportAdmin = () => {
    const [reportAccount, setReportAccount] = useState()
    const navigate = useNavigate()
    const [openLockAccount, setOpenLockAccount] = useState(false)
    const [openRejectReport, setOpenRejectReport] = useState()
    const [idAccountLock, setIdAccountLock] = useState()
    const [timeLockAccount, setTimeLockAccount] = useState(1)
    const [reasonReject, setReasonReject] = useState('')
    const [idReport, setIdReport] = useState()


    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const reportAccountApi = await axios.get("http://localhost:8080/admin/allReportAccount")
            setReportAccount(reportAccountApi.data)
            // console.log(reportAccountApi.data)

        } catch (error) {
            console.log(error);

        }
    }
    const avatarStyle = {
        height: "50px",
        width: "50px"
    }

    const acceptReport = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:8080/admin/acceptReportAccount?idReportAccount=${idReport}&idUser=${idAccountLock}&timeLockAccount=${timeLockAccount}`)
            if (response.status === 200) {
                message.success(response.data)
            }
            fetchData()
        } catch (error) {
            console.log(error);
            message.error("Không thể khóa, đã có lỗi xảy ra")
        }
    }

    const handleOk = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:8080/admin/rejectReportAccount?idReport=${idReport}&reasonReject=${reasonReject}`)
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

    const handleCancel = () => {
        setOpenRejectReport(false)
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
                        <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Tài khoản bị tố cáo</div>
                            <Table style={{ width: "100%" }} striped bordered hover>
                                <tbody>
                                    <tr>
                                        <td>Tài khoản bị báo cáo</td>
                                        <td>Tiêu đề</td>
                                        <td>Nội dung</td>
                                        <td>Ngày gửi</td>
                                        <td style={{ textAlign: "center" }}>Xử lý</td>
                                        <td>Người gửi</td>
                                    </tr>
                                    {reportAccount
                                        ?.filter(report => report.status === "Đang chờ xử lý")
                                        ?.map(report => (
                                            <tr key={report?.id} style={{ height: "100px" }}>
                                                <td>
                                                    <Row>
                                                        <Col xs={3}>
                                                            <button style={{ border: "none", background: "none" }}>
                                                                {report?.accused.avatar ? (
                                                                    <Avatar src={report?.accused.avatar} style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)}></Avatar>
                                                                ) : (
                                                                    <Avatar style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)}>{report?.accused.username[0].toUpperCase()}</Avatar>
                                                                )}
                                                            </button>
                                                        </Col>
                                                        <Col xs={9} style={{ display: "flex", alignItems: "center" }} >
                                                            <button onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)} style={{ border: "none", background: "none" }}>
                                                                <div >{report?.accused.name}</div>
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                </td>
                                                <td>{report?.title}</td>
                                                <td>{report?.content}</td>
                                                <td>{formatDate(report?.dateSend)}</td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <button onClick={() => {
                                                            setOpenLockAccount(true)
                                                            setIdReport(report?.id)
                                                            setIdAccountLock(report?.accused.id)
                                                        }} style={{ border: "none", width: "100px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            Khóa tài khoản
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
                        </Container>
                        <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Tố cáo đã xử lý</div>
                            <Table style={{ width: "100%" }} striped bordered hover>
                                <tbody>
                                    <tr>
                                        <td>Tài khoản bị báo cáo</td>
                                        <td>Tiêu đề</td>
                                        <td>Nội dung</td>
                                        <td>Ngày gửi</td>
                                        <td >Trạng thái</td>
                                        <td>Lý do</td>
                                        <td>Người gửi</td>
                                    </tr>
                                    {reportAccount
                                        ?.filter(report => report.status !== "Đang chờ xử lý")
                                        ?.map(report => (
                                            <tr key={report?.id} style={{ height: "100px" }}>
                                                <td>
                                                    <Row>
                                                        <Col xs={3}>
                                                            <button style={{ border: "none", background: "none" }}>
                                                                {report?.accused.avatar ? (
                                                                    <Avatar src={report?.accused.avatar} style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)}></Avatar>
                                                                ) : (
                                                                    <Avatar style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)}>{report?.accused.username[0].toUpperCase()}</Avatar>
                                                                )}
                                                            </button>
                                                        </Col>
                                                        <Col xs={9} style={{ display: "flex", alignItems: "center" }} >
                                                            <button onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)} style={{ border: "none", background: "none" }}>
                                                                <div >{report?.accused.name}</div>
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
                        <ReportProduct />
                    </Col>
                </Row>
            </Container>
            <Footer />
            <Modal
                title="Bạn muốn khóa tài khoản này ?"
                open={openLockAccount}
                onOk={acceptReport}
                onCancel={() => setOpenLockAccount(false)}
            >

                <div>Thời gian:  </div>
                <Select
                    defaultValue="1"
                    style={{ width: 120 }}
                    onChange={value => setTimeLockAccount(value)}
                    options={[
                        { value: '1', label: '1 ngày' },
                        { value: '3', label: '3 ngày' },
                        { value: '7', label: '7 ngày' },
                        { value: '30', label: '30 ngày' },
                        { value: '0', label: 'Vĩnh viễn' },
                    ]}
                />
            </Modal>
            <Modal
                title="Báo cáo này không được duyệt"
                open={openRejectReport}
                onOk={handleOk}
                onCancel={handleCancel}
            >

                <div>Lý do:  </div>
                <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={reasonReject} onChange={e => setReasonReject(e.target.value)}></TextArea>
            </Modal>
        </div>
    )
}
export default ReportAdmin