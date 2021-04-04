import React, {FunctionComponentElement, useEffect} from 'react';
import {Route, Switch, Redirect, RouteComponentProps, Link} from "react-router-dom";

import {showToast} from "@/utils/lightToast";

import {routers} from "@/routers/routers";

type Props = {
    list?: listItem[]
    type: "root" | "children"
}

type Slink = {
    children?: string | Com | JSX.Element
    to?: string | undefined
    fill_address?: boolean
}

type Com = React.FC | React.ComponentClass

export type listItem = {
    path?: string
    component?: Com
    exact?: boolean
    render?: (() => JSX.Element | Com) | any
    redirect?: string
    routes?: listItem[]
    onEnter?: () => void
}

// 取得有父子关系的路由组成的单独数组
const getPathArray = (list: listItem[]) => {
    if (!list) return
    // 过滤不含有path属性的路由
    const filterListMap = list.filter(i => i.path)
    // 声明最终抽出的数组
    const finalDrawOutArray: listItem[] = []
    const inner_drawOut = (item: listItem) => {
        const {path, component, exact, render, redirect, routes} = item
        item.routes && finalDrawOutArray.push({
            path, component, exact, render, redirect,
            routes: routes.map(inner_item => {
                const {path, component, exact, render, redirect} = inner_item
                inner_drawOut(inner_item)
                return {path, component, exact, render, redirect}
            })
        })
    }
    // 迭代获取含有父子关系的路由
    filterListMap.map(item => {
        inner_drawOut(item)
    })
    return finalDrawOutArray
}
// 获取含有父子关系的路由
let finalDrawOutArray = getPathArray(routers)
// 渲染层级
let level = 1

export const RouterRender: React.FC<Props> = ({type = "children", list = routers}) => {
    // 定义错误合集
    const errorMsgArray = ["render,redirect只能同时存在一个", "只能选用root，或children路由模式"]
    // 集中处理错误方法
    const showErrorMsg = (errorMsg: string) => {
        console.error(errorMsg)
        showToast(errorMsg, "error")
    }
    // render和redirect 的优先级处理 并返回Route 组件
    const RouteList = (list: listItem[]) => {
        const haveRedirectOrRender = (object: listItem) => {
            const haveRedirect = object.redirect
            const haveRender = object.render
            if (haveRedirect && !haveRender) {
                return () => <Redirect to={object.redirect}/>
            }
            if (haveRender && !haveRedirect) {
                return object.render
            }
            showErrorMsg(errorMsgArray[0])
        }
        return list.map((item, index) => {
            const {component, exact, path, onEnter} = item
            return component ? <Route
                exact={exact}
                path={path}
                component={component}
                key={`root_router_haveCom${index}`}
            /> : <Route
                exact={exact}
                path={path}
                render={haveRedirectOrRender(item)}
                key={`root_router_noCom${index}`}
            />
        })
    }
    // 两种模式的返回值
    if (type === "children") {
        // 获取当前的路由地址
        const HashPathName = window.location.hash.slice(1)
        // 当前地址下 子路由列表
        const childRouteList = finalDrawOutArray.map((item, index) => {
            let innerArray = HashPathName.split("/").filter(i => i)
            let newHashPathName
            innerArray.length > 1 ?
                newHashPathName = "/" + innerArray.slice(0, level).join("/") : null
            return item.path === newHashPathName ? {routes: item.routes, index} : null
        }).filter(i => i)[0]
        // 删除已加载路由
        childRouteList ? finalDrawOutArray.splice(childRouteList.index, 1) : null
        level += 1
        return childRouteList ? <Switch>
            {RouteList(childRouteList.routes)}
        </Switch> : <React.Fragment/>
    } else if (type === "root") {
        return <Switch>
            {RouteList(list)}
        </Switch>
    } else {
        showErrorMsg(errorMsgArray[1])
    }
}

const init = () => {
    level = 1
    finalDrawOutArray = getPathArray(routers)
}

export const bindEffect = (Children: Com) => {
    const InnerCom: React.FC<RouteComponentProps> = (props) => {
        // 重置参数
        init()
        // 每次路由改变就会重置渲染层级
        useEffect(() => {
            init()
        }, [props.location.pathname])
        return <Children {...props}/>
    }
    return InnerCom
}

export const SLink = (props: Slink) => {
    const {children, to, fill_address} = props
    const getHashPathName = document.location.hash.replace("#", "")
    return <Link
        to={!fill_address ? to : getHashPathName}
        replace={!!fill_address}
        onClick={() => init()}>
        {children}
    </Link>
}