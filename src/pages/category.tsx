import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from "react-router-dom";

import {ArticleData} from '@/components/public/articleList';
import {GoblogApiV1} from "@/utils/fetchApi";

import "./category.less";
import {Affix, Pagination} from "antd";

type matchParams = { category: string, name: string }

const Category: React.FC<RouteComponentProps> = (props) => {
    const [cid, setCid] = useState("")
    const [category, setCategory] = useState("")
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(0)
    const [data, setData] = useState([] as ArticleData[])
    const [easterEgg, setEasterEgg] = useState(false)
    const pageSize = 6

    useEffect(() => {
        const {category: cid, name: category} = (props.match.params as matchParams)
        setCid(cid)
        setCategory(category)
        getArticleData(1, cid)
    }, [props.match.params])

    const getArticleData = (pageNum: number, cid: string) => {
        GoblogApiV1.GET("/public/articleCategory/find", {
            pageSize, pageNum,
            cid: cid
        }).then(res => {
            setPageNum(pageNum)
            setData(res.data.data)
            setTotal(res.data.total)
        })
    }

    const renderCardList = data?.map((item, index) => {
        const {history} = props
        const {title, synopsis, createTime, img, id} = item
        return <div
            key={`card-list-${index}`}
            className="card-item"
            onClick={() => {
                history.push("/article/" + id)
            }}
        >
            <div className="top-pad">
                <div className="title">
                    {title}
                </div>
                <div className="info">
                    <div>
                        时间:<p>{createTime}</p>
                    </div>
                    <div>
                        简介:<p>{synopsis}</p>
                    </div>
                </div>
            </div>
            <div className="bottom-pad">
                <img src={img} alt=""/>
            </div>
        </div>
    })

    return (
        <Affix offsetTop={10}>
            <div className="category-pad">
                <div className="left-pad">
                    <div className="fill-background">
                        <div className="fill-pad">
                            <div className="category-name">
                                <p>{category}</p>
                            </div>
                            <p>分类下</p>
                            <p>文章有</p>
                            <p onClick={() => {
                                setEasterEgg(!easterEgg)
                            }}
                            >{`\{${total}\}`}</p>
                        </div>
                    </div>
                </div>
                <div className="right-pad">
                    <div className="category-article-pad">
                        {renderCardList}
                        <div className="pagination">
                            <Pagination
                                onChange={(page) => {
                                    getArticleData(page, cid)
                                }}
                                pageSize={pageSize} current={pageNum} total={total}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {easterEgg && <div style={{
                width: "100%",
                height: "100vh",
                backgroundColor: "black",
                color: "white",
                fontSize: "10rem",
                textAlign: "center",
                position: "relative"
            }}>
                <p style={{fontSize: "6rem"}}>
                    恭喜你发现一条彩蛋,请在这页面继续折腾,有奖励哦
                </p>
                <p>请继续往下看1</p>
                <p>请继续往下看2</p>
                <p>请继续往下看3</p>
                <p>请截图发微信给我</p>
                <p>我给你发6块的红包</p>
                <p>不开玩笑</p>
                <p>不开玩笑!</p>
                <p>不开玩笑!!</p>
                <p>不开玩笑!!!</p>
            </div>
            }
        </Affix>
    );
};

export default Category;