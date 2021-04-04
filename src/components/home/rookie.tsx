import React from 'react';
import {List} from "antd";
import ArticleList, {ArticleData} from "@/components/public/articleList";
import {RouteComponentProps, withRouter} from "react-router-dom";

import "./rookie.less";

const Rookie: React.FC<RouteComponentProps> = (props) => {
    const {history} = props
    const renderContent = (str: string) => {
        const spliceArr = (str: string) => {
            const newStr = str.slice(0, 400)
            const length = newStr.length
            const count = length / 200
            const innerArr = []
            for (let i = 0; i < count; i++) {
                const ruler = i * 200
                innerArr.push(str.slice(ruler, ruler + 200))
            }
            return innerArr
        }
        const innerArr = spliceArr(str)
        return innerArr.map((item, index) => {
            return <div
                className="content-item" key={`content_item_${index}`}
                style={innerArr.length <= 1 ? {width: "100%"} : null}>
                <p>{item}</p>
            </div>
        })
    }

    const listItemFunction = (item: ArticleData, index: number) => {
        const {id, img, createTime, name, synopsis, title} = item
        return <List.Item key={id}>
            <div
                onClick={() => {
                    history.push("/article/" + id)
                }}
                className="rookie-pad-item"
                style={((index + 1) % 2 == 1) ?
                    {flexDirection: "row-reverse"} : null}
            >
                <div className="left-pad">
                    <div className="title">
                        {title}
                    </div>
                    <div className="info">
                        <div>
                            时间:<p>{createTime}</p>
                        </div>
                        <div>
                            类型:<p>{name}</p>
                        </div>
                    </div>
                    <div className="content-group">
                        {renderContent(synopsis)}
                    </div>
                </div>
                <div className="right-pad"
                     style={((index + 1) % 2 == 1) ?
                         {left: "0"} : {left: "70%"}}>
                    <img src={img} alt=""/>
                </div>
            </div>
        </List.Item>
    }

    return (
        <ArticleList
            useWindow={true}
            apiAddress={"/public/boutique_article"}
            listItemFunction={listItemFunction}
            className={"rookie-pad"}
        />
    );
};

export default withRouter(Rookie);