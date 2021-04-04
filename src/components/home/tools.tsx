import React, {useEffect, useState} from 'react';

import {GoblogApiV1} from "@/utils/fetchApi";

import "./tools.less";

const Tools = () => {
    const [data, setData] = useState([{
        icon_img: "",
        link: "",
        title: "",
        introduce: ""
    }])

    useEffect(() => {
        GoblogApiV1.GET("/public/tools_link", {
            pageSize: 10,
            pageNum: 1
        }).then(res => {
            setData(res.data.data)
        })
    }, [])

    const renderLinks = data.map((item,index) => {
        const {icon_img, link, title, introduce} = item
        return <div key={`tool_link${index}`} className="tools-item">
            <img src={icon_img} alt={icon_img}/>
            <a href={link}  target="_blank">
                <h1>{title}</h1>
                <p>{introduce}</p>
            </a>
        </div>
    })

    return (
        <div className="tools-pad">
            {renderLinks}
        </div>
    );
};

export default Tools;