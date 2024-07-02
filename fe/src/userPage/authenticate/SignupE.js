import Footer from "../Footer";
import React, { useEffect, useState } from 'react';
import { Spin } from "antd"
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
import Swal from "sweetalert2";

export default function SignupE() {
    const nav = useNavigate()
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState({
        "email": "",
        "username":"",
        "password": ""
    })
    const [allAccount, setAllAccount] = useState([])
    const [errorEMAIL, setErrorEMAIL] = useState({
        "code": "", // 1: cho phép submit, 0: chặn submit
        "message": ""
    })
    const [errorUSER, setErrorUSER] = useState({
        "code": "", // 1: cho phép submit, 0: chặn submit
        "message": ""
    })
    const { email, username, password } = account
    const criteria = {
        hasUppercase: /[A-Z]/.test(password),
        hasDigit: /\d/.test(password),
        minLength: password.length >= 8
    };
    const onInputChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        const getAllAccount = async () => {
            try {
                const accountApi = await axios.get("http://localhost:8080/users")
                setAllAccount(accountApi.data)
            } catch (error) {
                console.log(error);
            }
        }
        getAllAccount()
    }, [])

    const checkEmail = (e) => {
        if (!allAccount.find(account => account.email === email)) {
            setErrorEMAIL({ code: 1, message: "" })
        } else {
            setErrorEMAIL({ code: 0, message: 'Email đã tồn tại' })
        }
    }
    const checkUsername = (e) => {
        if (!allAccount.find(account => account.username === username)) {
            setErrorUSER({ code: 1, message: "" })
        } else {
            setErrorUSER({ code: 0, message: 'Tên đăng nhập đã tồn tại' })
        }
    }
    const signup = async (e) => {
        setLoading(true)
        e.preventDefault()
        if (errorEMAIL.code && errorUSER.code && criteria.hasUppercase && criteria.hasDigit && criteria.minLength) {
            await axios.post("http://localhost:8080/signup", account)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đăng ký thành công',
                showConfirmButton: false,
                html: '<p>Đang chuyển hướng về màn hình chính...</p>',
                timer: 1500,
                height: "200px"
            });
            setTimeout(() => {
                nav('/verifyEmail',{state:{email:email}}); // Redirect to the signin page after 2 seconds
            }, 2000);
        }
        setLoading(false)
    }
    return (
        <Spin spinning={loading}>
            <div style={{ backgroundColor: "#FBFBFB", padding: "15px" }}>
                <Container>
                    <div style={{ display: "flex" }}>
                        <Link to="/"><img src="../images/logo.png" alt="Logo" style={{ height: "70px" }} /></Link>
                        <h4 className="fw-normal mb-3 ps-5 " style={{ marginTop: "20px" }}>Trang đăng ký</h4>

                    </div>
                </Container>
            </div>
            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='5'>

                        <div className='d-flex flex-row ps-5 pt-5'>
                            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />

                        </div>

                        <Form onSubmit={signup} className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Đăng ký bằng Email</h3>

                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="email" value={email} onChange={onInputChange} onBlur={checkEmail}type='email' size="lg" placeholder="Email" />
                            {errorEMAIL.message && <p style={{ color: 'red', marginLeft: "50px" }}>{errorEMAIL.message}</p>}
                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="username" value={username} onChange={onInputChange} onBlur={checkUsername} type='text' size="lg" placeholder="Tên đăng nhập" required/>
                            {errorUSER.message && <p style={{ color: 'red', marginLeft: "50px" }}>{errorUSER.message}</p>}

                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="password" value={password} onChange={onInputChange} type='password' size="lg" placeholder="Mật khẩu" required />
                            <div style={{ marginLeft: "40px" }}>
                                <p>
                                    <span style={{ color: criteria.hasUppercase ? 'green' : 'red' }}>
                                        {criteria.hasUppercase ? '✓' : '✗'} Mật khẩu chứa ít nhất 1 chữ viết hoa
                                    </span>
                                </p>
                                <p>
                                    <span style={{ color: criteria.hasDigit ? 'green' : 'red' }}>
                                        {criteria.hasDigit ? '✓' : '✗'} Mật khẩu chứa ít nhất 1 số
                                    </span>
                                </p>
                                <p>
                                    <span style={{ color: criteria.minLength ? 'green' : 'red' }}>
                                        {criteria.minLength ? '✓' : '✗'} Mật khẩu có ít nhất 8 ký tự
                                    </span>
                                </p>
                            </div>
                            <Button className="mb-4 px-5 mx-5 w-100" style={{ backgroundColor: '#FC5731', color: 'white' }} color='info' size='lg' type="submit">Đăng ký</Button>
                            <p className="small mb-5 pb-lg-3 ms-5"><Link className="text-muted" to="/signupS">Đăng ký với số điện thoại</Link></p>
                            <p className='ms-5'>Đã có tài khoản? <Link to={"/signin"} className="link-info">{loading ? 'Đợi một chút...' : 'Đăng ký'}</Link></p>

                        </Form>

                    </MDBCol>

                    <MDBCol sm='7' className='d-none d-sm-block px-0'>
                        <img src="./images/background.jpg"
                            alt="Login" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
            <br /><br />
            <Footer />
        </Spin>
    )
}