import React from 'react';
import { withRouter,RouteComponentProps} from 'react-router-dom';

const Page404:React.FC<RouteComponentProps> = (props) => {
    return (
        <div>
            404
            <button onClick={()=>{
                props.history.push("/")
            }}>回首页</button>
        </div>
    );
};

export default withRouter(Page404);