import React, {Component} from 'react';
import ToastifyStyle from "./toastify.style";
import GlobalPageStyle from "./general.style";

class GlobalStyle extends Component {
    render() {
        return (
            <>
                <ToastifyStyle />
                <GlobalPageStyle />
            </>
        );
    }
}

export default GlobalStyle;
