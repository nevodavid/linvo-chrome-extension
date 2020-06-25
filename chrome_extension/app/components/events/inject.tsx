import React, {Component} from 'react';
import {config} from "../../config/config";

interface InjectJsProps {
    id: number;
}

class Inject extends Component<InjectJsProps> {
    componentWillUnmount(): void {
        document.getElementById('linvo-second-script').remove();
    }

    componentDidMount(): void {
        const {id} = this.props;

        const script2 = document.createElement('script');
        script2.async = true;
        script2.src = `${config.pluginDomain}/js/plugin.bundle.js?id=${id}`;
        script2.id = 'linvo-second-script';

        document.body.appendChild(script2);
    }

    render() {
        return (
            <></>
        );
    }
}

export default Inject;
