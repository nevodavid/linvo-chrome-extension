import React, { Component } from 'react';

class FacebookPixelComponent extends Component<{name: string, id: string}> {
    load = (callback: (fbq: any) => void) => {
        return ((f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) => {
            if (f.fbq) {
                return callback(f.fbq);
            };
            n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
            return callback(f.fbq);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    }
  componentDidMount(): void {
        const {id, name} = this.props;
    this.load((fbq) => {
        fbq('init', id);
        fbq('trackCustom', name);
    });
  }

  render() {
    return (<></>);
  }
}

export default FacebookPixelComponent;
