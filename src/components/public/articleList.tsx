import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import {GoblogApiV1} from "@/utils/fetchApi";
import {showToast} from "@/utils/lightToast";

import {List, Spin} from "antd";

export type ArticleData = {
    "id"?: number
    "createTime"?: string
    "updateTime"?: string
    "deleteTime"?: string
    "name"?: string
    "title"?: string
    "cid"?: number
    "synopsis"?: string
    "content"?: string,
    "img"?: string
}

type Props = {
    apiAddress: string
    listItemFunction: (item: ArticleData, index: number) => JSX.Element
    className: string
    useWindow: boolean
}

const ArticleList: React.FC<Props> = (props) => {
    const {apiAddress, listItemFunction, className, useWindow} = props
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [pageNum, setPageNum] = useState(2)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        GoblogApiV1.GET(apiAddress, {
            pageSize: 10,
            pageNum: 1
        }).then(result => {
            setData(result.data.data)
            setTotal(result.data.total)
        })
        return () => {
            setPageNum(2)
            setData([])
        }
    }, [])


    const handleInfiniteOnLoad = () => {
        setLoading(true)
        if (!data.length) {
            setLoading(false)
            return
        }
        if (data.length > Number(String(total).slice(0, -1)) * 10) {
            showToast("到底了", "info")
            setLoading(false)
            setHasMore(false)
        } else {
            GoblogApiV1.GET(apiAddress, {
                pageSize: 10,
                pageNum: pageNum
            }).then(result => {
                setData([...data, ...result.data.data])
                setPageNum(prevState => prevState + 1)
                setLoading(false)
            })
        }
    };

    return (
        <div className={className}>
            <InfiniteScroll
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={useWindow}
                style={{width: "100%"}}
            >
                <List
                    dataSource={data}
                    renderItem={listItemFunction}
                >
                    {loading && hasMore && (
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            <Spin/>
                        </div>
                    )}
                </List>
            </InfiniteScroll>
        </div>
    );
};

export default ArticleList;