import Footer from "./Footer";
import React, { useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";

export default function Signin() {
    const nav = useNavigate()
    const [account, setAccount] = useState({
        "username": "",
        "password": ""
    })

    const { username, password } = account

    const onInputChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }

    const login = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/signin", account)
        console.log(response);
        if (response.token) {
            localStorage.setItem('token', response.token);
            nav("/")
            // Redirect to a protected route
        } else {
            alert('Login failed');
        }

    }

    return (
        <div>
            <div style={{ backgroundColor: "#FBFBFB", padding: "15px" }}>
                <Container>
                    <div style={{ display: "flex" }}>
                        <Link to="/"><img src="../images/logo.png" alt="Logo" style={{ height: "70px" }} /></Link>
                        <h4 className="fw-normal mb-3 ps-5 " style={{ marginTop: "20px" }}>Trang đăng nhập</h4>

                    </div>
                </Container>
            </div>
            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='5'>

                        <div className='d-flex flex-row ps-5 pt-5'>
                            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />

                        </div>

                        <Form onSubmit={login} className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Đăng nhập</h3>

                            <MDBInput name="username" value={username} onChange={onInputChange} wrapperClass='mb-4 mx-5 w-100' type='text' size="lg" placeholder="Email/ Tên đăng nhập/ Số điện thoại" />
                            <MDBInput name="password" value={password} onChange={onInputChange} wrapperClass='mb-4 mx-5 w-100' type='password' size="lg" placeholder="Mật khẩu" />

                            <Button className="mb-4 px-5 mx-5 w-100" style={{ backgroundColor: '#FC5731', color: 'white' }} color='info' size='lg' type="submit">Đăng nhâp</Button>
                            <p className="small mb-5 pb-lg-3 ms-5"><a className="text-muted" href="#!">Quên mật khẩu</a></p>
                            <p className='ms-5'>Không có tài khoản? <Link to={"/signupS"} className="link-info">Đăng ký</Link></p>

                        </Form>

                    </MDBCol>

                    <MDBCol sm='7' className='d-none d-sm-block px-0'>
                        <img src="./images/background.jpg"
                            alt="Login " className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
            <br /><br />
            <Footer />
        </div>
    )
}