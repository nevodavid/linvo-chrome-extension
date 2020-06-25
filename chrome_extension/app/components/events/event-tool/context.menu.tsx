import React, { Component } from 'react'
import $ from 'jquery';

interface ContextMenuPropsInterface {
    top: number;
    left: number;
    fullPath: string;
    close: () => void;
    save: (matchAll: boolean) => void;
}

interface ContextMenuStateInterface {
    current?: number;
    selectAllMatching: boolean;
    list: Array<{width: number, height: number, left: number, top: number}>;
}

export default class ContextMenu extends Component<ContextMenuPropsInterface, ContextMenuStateInterface> {
    state: ContextMenuStateInterface = {
        current: undefined,
        selectAllMatching: false,
        list: []
    };

    componentDidMount = () => {
        const {fullPath} = this.props;
        const list = $(fullPath).toArray().map((elm) => {
            const jqueryElement = $(elm);
            const offset = jqueryElement.offset();
            const width = jqueryElement.outerWidth();
            const height = jqueryElement.outerHeight();

            return {
                top: offset.top,
                left: offset.left,
                width,
                height
            };
        });

        this.setState({
            list
        });
    }

    timer = 0;

    changeCurrent = (value: undefined|number) => () => {
        const {close} = this.props;
        this.setState({
            current: value,
            selectAllMatching: value === 1
        });

        clearTimeout(this.timer);
        if (value === undefined) {
            this.timer = setTimeout(() => {
                close();
            }, 2000);
        }
    };

    save = (multi: boolean) => (e: any) => {
        const {save} = this.props;
        save(multi);
        e.preventDefault();
    };

    render() {
        const {top, left} = this.props;
        const {current, list, selectAllMatching} = this.state;
        return (
            <>
                {selectAllMatching && list.map(item => (
                    <div style={{zIndex: 999999998, background: 'rgba(0,0,0,.25)', width: item.width, height: item.height, top: item.top, left: item.left, position: 'absolute'}} />
                ))}
                <ul style={{top, left, position: 'fixed', zIndex: 999999999, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.75)', listStyle: 'none'}}>
                    <li onClick={this.save(false)} onMouseEnter={this.changeCurrent(0)} onMouseLeave={this.changeCurrent(undefined)} style={{cursor: 'pointer', background: current === 0 ? 'black' : 'transparent', padding: 5, borderBottom: '1px solid silver', color: 'white'}}>Select</li>
                    <li onClick={this.save(true)} onMouseEnter={this.changeCurrent(1)} onMouseLeave={this.changeCurrent(undefined)} style={{cursor: 'pointer', background: current === 1 ? 'black' : 'transparent', padding: 5, color: 'white'}}>Select all matching elements</li>
                </ul>
            </>
        )
    }
}
