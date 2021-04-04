import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import ArticleList, {ArticleData} from '../public/articleList';
import {List} from "antd";

import "./article.less";

const Article: React.FC<RouteComponentProps> = ({history}) => {

    const listItemFunction = (item: ArticleData, index: number) => {
        const {id, img, createTime, name, synopsis, content, title} = item
        return <List.Item key={id}>
            <div
                onClick={() => {
                    history.push("/article/" + id)
                }}
                className="list-item-card"
                style={((index + 1) % 2 == 1) ?
                    {flexDirection: "row-reverse"} : null}
            >
                <div className="left-pad">
                    <img src={img} alt="logo"/>
                </div>
                <div className="right-pad">
                    <div className="title">
                        {title}
                    </div>
                    <div className="info">
                        <span>创建日期:</span>
                        {createTime}
                    </div>
                    <div className="info">
                        <span>类型:</span>
                        {name}
                    </div>
                    <div className="info">
                        <span>简介:</span>
                        {synopsis}
                    </div>
                    <div className="content">
                        <span>内容:</span>
                        {content.slice(0, 50)}
                    </div>
                </div>
            </div>
        </List.Item>
    }


    return (
        <ArticleList
            useWindow={false}
            apiAddress={"/public/article"}
            listItemFunction={listItemFunction}
            className={"article-pad"}
        />
    );
};

export default withRouter(Article);