import React, { Component } from 'react'
import $ from 'jquery';
import ContextMenu from './context.menu';
import {EventEmitter} from "events";

const activate = new EventEmitter();

interface EventToolLayoutState {
    activate: boolean,
    element: any;
    width: number;
    height: number;
    top: number;
    left: number;
    mouseX: number;
    mouseY: number;
    showContext: boolean;
    fullPath: string;
    saveElement: (pageLocation: string, path: string, image: string) => void;
}

const $window = $(window);

class EventToolLayout extends Component<{}, EventToolLayoutState> {
    state: EventToolLayoutState = {
        activate: false,
        element: undefined,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        mouseX: 0,
        mouseY: 0,
        showContext: false,
        fullPath: '',
        saveElement: () => {}
    }

    div = React.createRef<HTMLDivElement>();

    path = '';
    pathMulti = '';
    pageLocation = '';
    picture: false|string = false;

    static elementDomPath( element: any, selectMany: boolean, depth: number ): any
    {
        const elementType = element.get(0).tagName.toLowerCase();
        if (elementType === 'body') {
            return '';
        }

        const id          = element.attr('id');
        const className   = element.attr('class');
        const name = elementType + ((id && `#${id}`) || (className && `.${className.split(' ').filter((a: any) => a.trim().length)[0]}`) || '');

        const parent = elementType === 'html' ? undefined : element.parent();
        const index = (id || !parent || selectMany) ? '' : ':nth-child(' + (Array.from(element[0].parentNode.children).indexOf(element[0]) + 1) + ')';

        return !parent ? 'html' : (
            EventToolLayout.elementDomPath(parent, selectMany, depth + 1) +
            ' ' +
            name +
            index
        );
    }

    listenToActivation = (callback: (pageLocation: string, path: string, image: string) => void) => {
        this.setState({
            activate: true,
            element: undefined,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            mouseX: 0,
            mouseY: 0,
            showContext: false,
            fullPath: '',
            saveElement: callback
        }, () => {
            $window.on('mousemove', this.mouseMove);
            $window.on('click', this.click);
        });
        }

    static Activate = (callback: (pageLocation: string, path: string, image: string) => void) => {
        setTimeout(() => {
            activate.emit('activate', callback);
        }, 500);
    }

    componentDidMount() {
        activate.addListener('activate', this.listenToActivation)
    }

    componentWillUnmount(): void {
        activate.removeListener('activate', this.listenToActivation);
    }

    lastElement: any;
    clonerElement: any;
    currentElement: any;

    mouseMove = (e: any) => {
        $(this.div.current).hide();
        const info = $(document.elementFromPoint(e.clientX, e.clientY));
        $(this.div.current).show();

        const position = info.offset();
        // @ts-ignore
        this.setState({
            element: info,
            width: info.outerWidth(),
            height: info.outerHeight(),
            top: position.top,
            left: position.left
        })
    }

    getElements = (elements: any, current?: any): any => {
        if (elements.length === 0) {
            return [current];
        }
        const first = elements[0].trim();
        const find = current ? current.find(first) : $('html');
        return find.toArray().reduce((all: any, current: any) => ([
            ...all,
            ...this.getElements(elements.slice(1, elements.length - 1), $(current))
        ]), []);
    };

    static cropCanvas = (sourceCanvas: any,left: any, top: any,width: any,height: any) => {
        let destCanvas = document.createElement('canvas');
        destCanvas.width = width;
        destCanvas.height = height;
        destCanvas.getContext("2d").drawImage(
            sourceCanvas,
            left,top,width,height,  // source rect with content to crop
            0,0,width,height);      // newCanvas, same size as source rect
        return destCanvas;
    }

    click = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const {element} = this.state
        $window.off('mousemove', this.mouseMove);
        $window.off('click', this.click);
        this.pageLocation = location.href;

        const {left, top, width, height} = this.state;
        const _this = this;

        $(this.div.current).hide();
        setTimeout(() => {
            chrome.runtime.sendMessage({todo: "screenshot"}, function(response) {
                $(_this.div.current).show();
                const image = new Image();
                const canvas = document.createElement('canvas');

                image.onload = function() {
                    // @ts-ignore
                    image.width = window.innerWidth;
                    image.height = window.innerHeight;

                    // @ts-ignore
                    canvas.width = window.innerWidth;
                    // @ts-ignore
                    canvas.height = window.innerHeight;

                    const ctx = canvas.getContext("2d");
                    const lightCanvas = document.createElement('canvas');
                    lightCanvas.width = window.innerWidth;
                    lightCanvas.height = window.innerHeight;

                    ctx.drawImage(image, 0, 0, window.innerWidth, window.innerHeight);
                    ctx.drawImage(lightCanvas, 0, 0);

                    _this.picture = EventToolLayout.cropCanvas(canvas, left, top - $(document).scrollTop(), width, height).toDataURL("image/png");
                };
                image.src = response.img;
            });

        this.pathMulti = EventToolLayout.elementDomPath(element, true, 0);
        this.path      = EventToolLayout.elementDomPath(element, false, 0);
        this.setState({
            mouseX: e.clientX - 50,
            mouseY: e.clientY,
            showContext: true,
            fullPath: this.pathMulti
        });
    }, 100);
    };

    close = () => {
        this.setState({
            element: undefined,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            mouseX: 0,
            mouseY: 0,
            showContext: false,
            fullPath: '',
            saveElement: () => {}
        });
    };

    getPicture = async (): Promise<string> => {
        if (this.picture) {
            return this.picture;
        }

        await new Promise((res) => {
            setTimeout(() => res(true), 20);
        });

        return this.getPicture();
    }

    save = (multi: boolean) => {

        const {saveElement} = this.state;
        this.close();

        const {pathMulti, path} = this;
        this.getPicture().then((picture: string) => {
            saveElement(this.pageLocation, multi ? pathMulti : path, picture);
            this.path = '';
            this.pathMulti = '';
        });
    }

    render() {
        const {mouseX, mouseY, top, left, width, height, showContext, fullPath, activate} = this.state;
        return !activate ? <></> : (
            <div>
                {showContext && <ContextMenu save={this.save} close={this.close} fullPath={fullPath} left={mouseX} top={mouseY} />}
                <div ref={this.div} style={{top, left, width, height, background: 'rgba(0,0,0,0.25)', zIndex: 999999997, position: 'absolute'}} />
            </div>
        )
    }
}

export default EventToolLayout;
