import React, {useEffect, useState} from 'react';

import Modal from '../public/modal';
import Verification from '../public/verification';
import {showToast} from "@/utils/lightToast";
import {GoblogApiV1} from "@/utils/fetchApi";
import {matchSpecialSymbol} from "@/utils/stringMatchingTool";

import "./loginAndRegister.less";

const LoginAndRegister = () => {
    const [visible, setVisible] = useState(false)
    const [verStatus, setVerStatus] = useState(false)
    const [operationStatus, setOperationStatus] = useState(true)
    const [repeatPassword, setRepeatPassword] = useState("")
    const [data, setData] = useState({username: "", password: ""})
    const [haveLogin, setHaveLogin] = useState(false)

    const verificationFunc = (prototype: "username" | "password", message: string) => {
        if (!data[prototype].length || data[prototype].length < 4 || data[prototype].length > 20) {
            showToast(message, "info")
            return true
        }
        if (matchSpecialSymbol(data[prototype])) {
            showToast("请勿输入特殊字符", "info")
            return true
        }
        return false
    }

    useEffect(() => {
        localStorage.getItem("token") ? setHaveLogin(true) : null
    }, [])

    const submit = () => {
        const login = () => {
            GoblogApiV1.POST("/public/login", data).then(res => {
                if (res.status === 200) {
                    showToast("登录成功", "success")
                    localStorage.setItem("token", res.token)
                    localStorage.setItem("userId", res.id)
                    setData({username: "", password: ""})
                    setRepeatPassword("")
                    setVisible(false)
                    setHaveLogin(true)
                }
            })
        }
        if (verificationFunc("username", "用户名须在4-20位之间")) return
        if (verificationFunc("password", "密码必须在4-20位之间")) return
        if (!verStatus) {
            showToast("请完成验证", "info");
            return
        }
        if (!operationStatus) {
            if (data.password !== repeatPassword) {
                showToast("两次密码输入不一致", "info")
                return
            }
            GoblogApiV1.POST("/public/user/add", {...data, role: 2}).then(res => {
                setOperationStatus(true)
                if (res.status === 200) login()
            })
        }
        if (operationStatus) {
            login()
        }
    }

    return (
        <div className="login-and-register-pad">
            <div className="button" onClick={() => {
                if (haveLogin) {
                    localStorage.removeItem("token")
                    localStorage.removeItem("userId")
                    setHaveLogin(false)
                    return
                }
                setVisible(true)
            }}>
                {haveLogin ? "注销" : "登录"}
            </div>
            <Modal visible={visible} hiddenHandleChange={(visible) => {
                setVisible(visible)
            }}>
                <div className="operation-pad">
                    <div className="center-pad">
                        <div className="title">
                            {operationStatus ? "登录" : "注册"}
                        </div>
                        <div className="form-pad">
                            <div className="input-item">
                                <label htmlFor="username">用户名</label>
                                <input
                                    value={data.username}
                                    onChange={(event) => {
                                        setData({...data, username: event.target.value})
                                    }}
                                    id="username" type="text"/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="password">密码</label>
                                <input
                                    value={data.password}
                                    onChange={(event) => {
                                        setData({...data, password: event.target.value})
                                    }}
                                    id="password" type="password"
                                />
                            </div>
                            {!operationStatus && <div className="input-item">
                                <label htmlFor="password">重复密码</label>
                                <input
                                    value={repeatPassword}
                                    onChange={(event) => {
                                        setRepeatPassword(event.target.value)
                                    }}
                                    id="password" type="password"
                                />
                            </div>}
                            <Verification
                                status={verStatus}
                                successCallBack={(status) => setVerStatus(status)}
                                width={"100%"} height={"3rem"}
                            />
                            <div className="info">
                                {operationStatus ? "没有账号?" : "已有账号?"}
                                <a onClick={() => {
                                    setVerStatus(false)
                                    setOperationStatus(!operationStatus)
                                }}>
                                    {operationStatus ? "注册" : "登录"}
                                </a>
                            </div>
                            <div onClick={() => submit()} className="button">
                                {operationStatus ? "登录" : "注册"}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default LoginAndRegister;