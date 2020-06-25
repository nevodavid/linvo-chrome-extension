import React, {Component} from 'react';

import {config} from "../../config/config";
import {axiosInstance} from "../../../chrome/extension/todoapp";

class Axios extends Component {
    componentDidMount(): void {
        axiosInstance.defaults.baseURL = config.apiUrl;
    }

    render() {
        return (
            <></>
        );
    }
}

export default Axios;
