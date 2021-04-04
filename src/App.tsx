import React, {useLayoutEffect, useState} from "react";
import {bindEffect, RouterRender, SLink} from "./utils/routerRender";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {useSelector} from "react-redux";
import {HomeOutlined, MessageOutlined, RollbackOutlined} from "@ant-design/icons";
import {ReduxRootType} from "./config/reducers";

import Navbar from "@/components/app/navbar";
import LoginAndRegister from "./components/app/loginAndRegister";

import "./App.less";
import "@/assets/reset.css";

const App: React.FC<RouteComponentProps> = (props) => {
    const [titleAnimation, setTitleAnimation] = useState(false)

    const titleReducer = useSelector((state: ReduxRootType) => {
        return state.titleReducer
    })

    const {location, history, match} = props

    useLayoutEffect(() => {
        console.log("APP首页被加载了")
        setTitleAnimation(false)
        setTimeout(() => {
            setTitleAnimation(true)
        }, 100)
    }, [titleReducer])

    const splitTitleObject = (obj: { [key: string]: string }) => {
        const innerObj = {} as { [key: string]: Array<string> }
        const keys = Object.keys(obj)
        Object.values(obj).map((item: string, index: number) => {
            const str1 = item.slice(0, -1)
            const str2 = item.slice(item.length - 1)
            innerObj[keys[index]] = [str1, str2]
        })
        return innerObj
    }

    const sliceArr = splitTitleObject(titleReducer)
    const {type, title, span, date} = sliceArr
    const reRender = title[0][0] === "<"

    return (
        <div className="app-pad">
            <LoginAndRegister/>
            <div style={{width: "100%", height: "100%"}}>
                <div
                    key={"header_item_1"}
                    className={`header ${titleAnimation ? "queue-anim-entering" : "queue-anim-leaving"}`}
                >
                    <div><span className="copy-right">{type[0]}</span>{type[1]}</div>
                    <div
                        className="big-title"
                        style={reRender ? {fontSize: "5rem"} : null}
                    >
                        <div
                            className="text"
                            style={reRender ? {letterSpacing: "0.5rem"} : null}
                            dangerouslySetInnerHTML={reRender ?
                                {__html: title[0] + title[1]} : {__html: title[0]}}
                        />
                        <div
                            style={{display: "inline-block"}}
                            dangerouslySetInnerHTML={!reRender ?
                                {__html: title[1]} : null}
                        />
                        <span>{span[0]}{span[1]}</span>
                    </div>
                    <div className="web-stack">
                        <div className="text">{date[0]}</div>
                        <span>{date[1]}</span>
                    </div>
                </div>
            </div>
            <div className="app-hr"/>
            <div className="navbar-link">
                <div style={{width: "50%"}}>
                    <div className="navbar-link-items">
                        {!match.isExact &&
                        <div className="out-item">
                            <div onClick={() => {
                                history.goBack()
                            }}>
                                <RollbackOutlined style={{marginRight: "0.5rem"}}/>
                                <span>返回</span>
                            </div>
                        </div>}
                        <SLink to="/guestbook">
                            <div>
                                <MessageOutlined style={{marginRight: "0.5rem"}}/>
                                <span>留言板</span>
                            </div>
                        </SLink>
                        {!match.isExact &&
                        <SLink to="/">
                            <div>
                                <HomeOutlined style={{marginRight: "0.5rem"}}/>
                                <span>首页</span>
                            </div>
                        </SLink>}
                    </div>
                </div>
                <div style={{width: "50%"}}>
                    <Navbar/>
                </div>
            </div>
            <div className="app-hr" style={{height: "0.2rem", marginTop: "0"}}/>
            <RouterRender type="root"/>
        </div>
    );
}

export default withRouter(bindEffect(App))
