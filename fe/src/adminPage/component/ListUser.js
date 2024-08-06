import { Avatar, message } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { FaCheck } from "react-icons/fa";
import { CiLock, CiUnlock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import Footer from "../Footer";

const ListUser = () => {
    const [user, setUser] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const userApi = await axios.get("http://localhost:8080/users")
            console.log(userApi.data);
            setUser(userApi.data.filter(user => user.role === "USER"))
        } catch (error) {
            console.log(error);
        }
    }

    const changeStatusAccount = async (idUser) => {
        try {
            const response = await axios.post(`http://localhost:8080/admin/changeStatusAccount?idUser=${idUser}`)
            if(response.status===200){
                message.success("Thành công")
            } else{
                message.error("Đã xảy ra lỗi")
            }
            fetchData()
        } catch (error) {
            console.log(error);
        }
    }

    const avatarStyle = {
        height: "50px",
        width: "50px"
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
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Quản lý tài khoản người dùng</div>
                            <table style={{ width: "100%", textAlign: "center" }} className="table table-striped">
                                <thead>
                                    <tr>
                                        <td>Tài khoản</td>
                                        <td>Tên đăng nhập</td>
                                        <td>Email</td>
                                        <td>Họ tên</td>
                                        <td>Xác nhận tài khoản</td>
                                        <td>Trạng thái tài khoản</td>
                                        <td>Thao tác</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user?.map(user => (
                                        <tr key={user?.id} style={{ height: "70px", alignItems: "center" }} >
                                            <td>
                                                {user?.avatar ? (

                                                    <Avatar src={user?.avatar} style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${user?.id}`)}></Avatar>
                                                ) : (
                                                    <Avatar style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${user?.id}`)}>{user?.username[0].toUpperCase()}</Avatar>
                                                )}
                                            </td>
                                            <td>{user?.username}</td>
                                            <td>{user?.email}</td>
                                            <td>{user?.name}</td>
                                            <td>{user?.activeEmail ? (<FaCheck style={{ color: "green" }} />) : "❌"}</td>
                                            <td>{user?.status ? (<span style={{ color: "green" }}>Bình thường</span>) : (<span style={{ color: "red" }}>Bị Khóa</span>)}</td>
                                            <td>{user?.status ?
                                                (<button onClick={() => changeStatusAccount(user?.id)} style={{ border: "none", background: "none" }}>
                                                    <CiLock />
                                                </button>) :
                                                (<button onClick={() => changeStatusAccount(user?.id)} style={{ border: "none", background: "none" }}>
                                                    <CiUnlock />
                                                </button>)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default ListUser