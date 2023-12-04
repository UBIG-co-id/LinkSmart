import React, { useState } from 'react'
import Head from '../../layout/Head'
import Logo from '../../component/Images/logo2x.png'
import LogoDark from '../../component/Images/logo-dark2x.png'
import { Block, BlockHead, BlockContent, BlockTitle, BlockDes, PreviewCard, Icon, Button } from '../../component/Component'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
const Login = () => {
    const navigate = useNavigate();
    // const [userName, setUserName] = useState('');
    // const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passState, setPassState] = useState(false);
    // const [errorVal, setError] = useState("");
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await fetch(
                `https://linksmart-1-t2560421.deta.app/login/users?username=${encodeURIComponent(data.username)}&password=${encodeURIComponent(data.password)}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
    
            if (response.ok) {
                const responseData = await response.json();
                const token = responseData;
                localStorage.setItem('jwtToken', token);
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                if (response.status === 401) {
                    setError('Invalid email or password');
                } else if (response.status === 400 && errorData.error === 'invalid_username') {
                    setError('Username is incorrect');
                } else if (response.status === 400 && errorData.error === 'invalid_password') {
                    setError('Password is incorrect');
                } else {
                    setError('An error occurred during login');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred during login');
        }
    };
    
    // const { register, formState: { errors } } = useForm();
    return <>

        <Head title="Login" />
        <Block className="nk-block-middle nk-auth-body  wide-xs">
            <div className="brand-logo pb-4 text-center">
                <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
                    <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                    <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
                </Link>
            </div>


            <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                <BlockHead>
                    <BlockContent>
                        <BlockTitle tag="h4">Sign-In</BlockTitle>
                        <BlockDes>
                            <p>Access Dashlite using your email and passcode.</p>
                        </BlockDes>
                    </BlockContent>
                </BlockHead>
                {error && (
                    <div className="mb-3">
                        <Alert color="danger" className="alert-icon">
                            <Icon name="alert-circle" /> UserName atau Password salah{" "}
                        </Alert>
                    </div>
                )}
                <Form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <div className="form-label-group">
                            <label className="form-label" htmlFor="default-01">
                                Username
                            </label>
                        </div>
                        <div className="form-control-wrap">
                            <input
                                type="username"
                                name="username"
                                id="username"
                                placeholder="UserName"
                                className={`form-control-lg form-control ${errors.username ? "is-invalid" : ""}`}
                                {...register("username", { required: "Username is required" })}
                            />
                            {errors.username && <span className="invalid">{errors.username.message}</span>}

                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-label-group">
                            <label className="form-label" htmlFor="password">
                                Passcode
                            </label>
                            <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                                Forgot Code?
                            </Link>
                        </div>
                        <div className="form-control-wrap">
                            <a
                                href="#password"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    setPassState(!passState);
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                            >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                            </a>
                            <input
                                type={passState ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Password"
                                className={`form-control-lg form-control ${errors.password ? "is-invalid" : ""}`}
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <span className="invalid">{errors.password.message}</span>}

                        </div>
                    </div>
                    <div className="form-group">
                        <Button size="lg" className="btn-block" type="submit" color="primary">
                            {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                        </Button>
                    </div>
                </Form>

            </PreviewCard>
        </Block>
        {/* <AuthFooter /> */}

    </>

}

export default Login
