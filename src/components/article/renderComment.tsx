import React, {useEffect, useRef, useState} from 'react';
import {Affix} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import CommentList from '../public/commentList';

import "./renderComment.less";
import {useDispatch, useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";
import {COMMENT_AND_REPLY_TYPES} from "@/redux/commentAndReplyReducer";
import {showToast} from "@/utils/lightToast";
import {matchSpecialSymbol} from "@/utils/stringMatchingTool";

type Props = {
    commentApiAddress: string
    replyApiAddress: string
    articleId: string
}

const RenderComment: React.FC<Props> = (props) => {
    const {commentApiAddress, articleId, replyApiAddress} = props
    const [data, setData] = useState([])
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
        return () => {
            setPageNum(1)
            setData([])
            initReply()
        }
    }, [])

    const getCommentData = (pageNum: number) => {
        GoblogApiV1.GET(commentApiAddress, {
            pageSize: pageSize,
            pageNum: pageNum,
            articleId
        }).then(result => {
            if (result.data.data) {
                setPageNum(pageNum)
                setData(result.data.data)
                setTotal(result.data.total)
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
            articleId: Number(articleId)
        }) : GoblogApiV1.POST("/comment/add", {
            content: textareaValue,
            commenterId: Number(userId),
            articleId: Number(articleId)
        })
        promise.then(res => {
            if (res.status === 200) {
                setTextareaValue("")
                getCommentData(pageNum)
                initReply()
            }
        })
    }

    return (
        <Affix offsetTop={20}>
            <div className="article-comment-pad">
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
        </Affix>
    )
};

export default RenderComment;