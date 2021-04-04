import React, {useEffect, useState} from 'react';

import "./introduction.less";
import {GoblogApiV1} from "@/utils/fetchApi";

const Introduction = () => {
    const [data, setData] = useState({fill_string: "", image: "", name: "", wechat: "", address: ""})
    const {fill_string, image, name, wechat, address} = data

    useEffect(() => {
        GoblogApiV1.GET("/public/info/1").then(res => {
            setData(res.data)
        })
    }, [])

    return (
        <div className="introduction-pad">
            <div className="fill-string"><p>{fill_string}</p></div>
            <div className="info-pad">
                <div className="avatar">
                    <img src={image} alt="avatar"/>
                </div>
                <div className="info-item">跑路人姓名:<span>{name}</span></div>
                <div className="info-item">跑路人微信:<span>{wechat}</span></div>
                <div className="info-item">跑路人地址:<span>{address}</span></div>
            </div>
        </div>
    );
};

export default Introduction;