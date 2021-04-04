import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Timeline} from 'antd';
import {ClockCircleOutlined} from '@ant-design/icons';

import CommentList from "@/components/public/commentList";
import {ReduxRootType} from "@/config/reducers";
import {GoblogApiV1} from "@/utils/fetchApi";
import {COMMENT_AND_REPLY_TYPES} from "@/redux/commentAndReplyReducer";
import {showToast} from "@/utils/lightToast";
import {matchSpecialSymbol} from "@/utils/stringMatchingTool";

const Guestbook = () => {
    const commentApiAddress = "/public/comment/find"
    const replyApiAddress = "/public/reply/find"
    const [data, setData] = useState([])
    const [timeline, setTimeline] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(0)
    const [textareaValue, setTextareaValue] = useState("")
    const {replyToCommentId, replyName} = useSelector((state: ReduxRootType) => {
        return state.commentAndReplyReducer
    })
    const textareaRef = useRef(null)
    const dispatch = useDispatch()

    const conditionStatus = replyToCommentId > 0
    const pageSize = 5

    useEffect(() => {
        if (replyName) {
            setTextareaValue("回复" + replyName + "说")
            textareaRef.current.focus()
        }
    }, [replyToCommentId])

    useEffect(() => {
        getCommentData(pageNum)
        getTimelineData(20, 1)
        return () => {
            setPageNum(1)
            setData([])
            initReply()
        }
    }, [])

    const getCommentData = (pageNum: number) => {
        GoblogApiV1.GET(commentApiAddress, {
            pageSize: pageSize,
            pageNum: pageNum
        }).then(result => {
            if (result.data.data) {
                setPageNum(pageNum)
                setData(result.data.data)
                setTotal(result.data.total)
            }
        })
    }

    const getTimelineData = (pageSize: number, pageNum: number) => {
        GoblogApiV1.GET("/public/timeline/find", {
            pageSize: pageSize,
            pageNum: pageNum,
            guestbook: "true"
        }).then(result => {
            if (result.data.data) {
                setTimeline(result.data.data)
            }
        })
    }

    const initReply = () => {
        dispatch({
            type: COMMENT_AND_REPLY_TYPES.INIT_COMMENT_AND_REPLY_CONDITION
        })
    }

    const commitCommentOrReply = () => {
        const userId = localStorage.getItem("userId")
        if (!userId) {
            showToast("请登录", "info")
            return
        }
        if (matchSpecialSymbol(textareaValue)) {
            showToast("请勿输入特殊字符", "info")
            return
        }
        if (!textareaValue.length) return
        const promise = conditionStatus ? GoblogApiV1.POST("/reply/add", {
            content: textareaValue,
            replierId: Number(userId),
            replyToCommentId,
            guestbook: "true"
        }) : GoblogApiV1.POST("/comment/add", {
            content: textareaValue,
            commenterId: Number(userId),
            guestbook: "true"
        })
        promise.then(res => {
            if (res.status === 200) {
                setTextareaValue("")
                getCommentData(pageNum)
                initReply()
            }
        })
    }

    const renderTimelineItem = timeline.map((item, index) => {
        const {title, com, color} = item
        return <Timeline.Item
            style={{fontSize:"1.4rem"}}
            color={color}
            dot={Number(com) > 0 && <ClockCircleOutlined style={{fontSize: "16px"}}/>}
            key={`timeline-${index}`}
        >
            {title}
        </Timeline.Item>
    })


    return (
        <div style={{marginTop: "2rem"}}>
            <div style={{
                width: "100%",
                margin: "0 auto",
                display: "flex",
            }}>
                <div style={{
                    padding: "1rem",
                    width: "60%",
                }}>
                    <div style={{marginBottom:"1rem",fontSize:"1.6rem",fontWeight:600}}>
                        <p>博客基础信息</p>
                    </div>
                    <Timeline>
                        {renderTimelineItem}
                    </Timeline>
                </div>
                <div className="article-comment-pad"
                     style={{
                         border: "none",
                         width: "40%"
                     }}
                >
                    <div className="textarea-pad">
                        <div className="title">
                            <p>评论区({conditionStatus ? "回复状态" : "评论状态"})</p>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={textareaValue}
                            onChange={(event) => {
                                setTextareaValue(event.target.value)
                            }}
                            rows={3}
                            className="textarea"
                            placeholder="请输入评论"/>
                        <div className="button-group">
                            {conditionStatus && <div
                                className="button"
                                onClick={() => {
                                    setTextareaValue("")
                                    initReply()
                                }}
                            >
                                <span>撤销回复</span>
                            </div>}
                            <div className="button"
                                 onClick={() => commitCommentOrReply()}
                            >
                                <span>发表</span>
                            </div>
                        </div>
                    </div>
                    <div className="title"><p>共{total}条评论</p></div>
                    <div className="comment-pad">
                        <CommentList
                            getCommentDataFunc={getCommentData}
                            initData={data}
                            pageSize={pageSize}
                            total={total}
                            apiAddress={replyApiAddress}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guestbook;