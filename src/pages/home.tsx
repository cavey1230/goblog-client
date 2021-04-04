import React from 'react';
import {Affix} from "antd";

import Article from "@/components/home/article";
import Introduction from '@/components/home/introduction';
import Rookie from '@/components/home/rookie';
import Tools from "@/components/home/tools";
import Blogroll from "@/components/home/blogroll";
import Copyright from '@/components/home/copyright';

import "./home.less";
import Navbar from "@/components/app/navbar";

type Props = {
    title_string: string
    style?: Object
}

const Home = () => {
    const RenderHr: React.FC<Props> = ({title_string, style}) => {
        return <div style={style} className="article-hr">
            <div className="text">{title_string}</div>
        </div>
    }
    return (
        <React.Fragment>
            <div className="home-pad">
                <div className="left">
                    <RenderHr title_string="今日快报"/>
                    <Introduction/>
                    <Affix offsetTop={20}>
                        <div>
                            <RenderHr title_string="老刘的工具箱"/>
                            <Tools/>
                        </div>
                    </Affix>
                </div>
                <div className="center">
                    <div style={{width:"100%",minHeight:"40rem",position:"relative"}}>
                        {/*<div className="center-title">*/}
                        {/*    已踩200坑*/}
                        {/*</div>*/}
                        <div className="center-img">
                            <img draggable="false" src="http://letslearn.ink/canva-MAEDhkXkgJ8.png" alt="pic1"/>
                        </div>
                    </div>
                    <RenderHr style={{marginTop: "-20rem"}}  title_string="精选文章"/>
                    <Rookie/>
                </div>
                <div className="right">
                    <RenderHr title_string="最近踩的坑(区域内滚动查看更多)"/>
                    <Article/>
                    <Affix offsetTop={20}>
                        <div>
                            <RenderHr title_string="友情链接"/>
                            <Blogroll/>
                            <RenderHr title_string="版权信息"/>
                            <Copyright/>
                        </div>
                    </Affix>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;