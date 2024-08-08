import { Container } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { IoNotificationsOutline } from "react-icons/io5";
import { Avatar, Dropdown } from "antd";
import { useEffect, useState } from "react";

const Header = () => {
    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")))
    const navigate = useNavigate()

    useEffect(() => {
        const adminLocal = JSON.parse(localStorage.getItem("admin"))
        setAdmin(adminLocal)
    }, [])

    const items = [
        {
            label: "Tài khoản",
            key: "/admin/profile",
        },
        {
            label: "Đăng xuất",
            key: "logout",
        },
    ];
    const handleDropdownItemClick = (e) => {
        if (e.key === "logout") {
            localStorage.removeItem("admin")
            localStorage.removeItem("isAdminAuthenticated")
            navigate("/admin/signin")
        } else {
            navigate(e.key);
        }
    };
    return (
        <div style={{borderBottom:"3px solid #F5F5F7",boxShadow:"0 2px 5px rgba(0, 0, 0, 0.5)",marginBottom:"5px"}}>
            <Container style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="col-sm-2" style={{ height: "130px", paddingTop: "20px" }}>
                    <Link to="/"><img src="../images/logo2.png" alt="Logo" style={{ width: "auto", height: "80%" }} /></Link>
                </div>
                <div style={{ height: "130px  ", display: "flex", }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center', // Căn giữa theo chiều dọc
                        justifyContent: 'center'
                    }}>
                        <IoNotificationsOutline style={{marginRight:"20px", border: "solid 1px #F5F5F5", fontSize: "30px", color: "#8E92BC", borderRadius: "50%", padding: "10px", height: "35%", width: "auto" }} />
                        <Dropdown
                            menu={{ onClick: handleDropdownItemClick, items: items }}
                            arrow
                            placement="bottom"
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            {admin?.avatar ? (

                                <Avatar src={admin?.avatar} style={{ height: "45px", width: "auto" }}></Avatar>
                            ) : (
                                <Avatar>{admin?.username[0].toUpperCase()}</Avatar>
                            )}
                        </Dropdown>
                    </div>
                </div>
            </Container >
        </div >
    )
}
export default Header