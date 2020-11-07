import React, {FunctionComponent, useEffect, useState} from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import styled, {
    createGlobalStyle, keyframes,
    StyleSheetManager,
} from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../../store/configure.store";
import { ConnectionsReducerState } from "../../store/reducers/connections.reducer";
import BatchComponent from "../batch/batch.component";
import LinvoDB from "../../../dbs/posts.db";
import {getStyles} from "../../background";

const HelperStyle = styled.div`
  position: fixed !important;
  right: 0 !important;
  z-index: 9999999 !important;
  width: 300px;
  height: 80% !important;
  top: 10% !important;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2) !important;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.5s;
  ${(params: { show: boolean }) =>
    !params.show ? "transform: translateX(100%);" : ""}
  iframe {
    width: 100% !important;
    height: 100% !important;
    border: 0 !important;
  }
`;

export const Global = createGlobalStyle`
html {
  font-family: 'Montserrat', sans-serif;
  background: white !important;
}
h2 {
    color: #7367f0;
    padding-left: 1rem;
    font-weight: 600;
    letter-spacing: .01rem;
    font-size: 1.57rem;
}
.logo {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAABICAYAAAD1ctupAAASJklEQVR4nO1dC3Bc1Xn+zr13H3qjh+WHLBtjbBMRlGIeCUuADcWmzRQYFgrLJmEKpQlp2g6EKSVNMWKgkJIAoS2kkDJAm7gmgJI2GWhpKKLAUscB7LVlWZZtSbvSSqvVSvt+3cfpnNVZsY8rWStLYmX7m9nR7nnd/+6395z//Of/f+E0TuM0TuPUACnHu6SUzqmdw+66EMCLAFbkdgfQA+CrAIYXTciZIQL4FwBX5bRg33MIwEO8Lg87d7UXDUbIJ9RIn8JNLBgo1d4gRGjSGW+lpqm7BEG8rIRrVQCoAVALoJJ/sWkAMQBhAFEAyvEGoaA7CIhDp4r9kF4C8CqAeCnfwbIlyWF3baCUNpIZ5gJBEL84S3dGxucAXATgAgBnAVgFoAGAGYCBt1MByJwgPwAPgAMAPgLwGwADvM00YrGwvbqqbsYLJ5Pxi83myq5S7nXZkuQZOryuZc3GUqZr9s1tA3ADAPaEtcyhj8AJY09WM4BzAfwer0sB6Abw7wBe41OspqrKzAwBCEyMbGpZs/HUIKkEbALwTQpqJyCrF3BcE4Ct/LUDwHsAfigQQZitE6V01no9nLQkUVAQkCcBfIOtN2RxdSSmLFwB4PLqmjMWfPCTliROyl1LfdnF+DGcCtPdnKBRDXI6hVQ6kfmrqAqopmW6CqIISTLAaDDDbK6EKElY5CczD6csSZRqiMUjmAyOIRQOIJ6IyKl0wqdqCttbjXG1O82bM/W8gYA0GyTjmSZjRW1Ndb1QV9uEurpGmE2ViyrrKUdSMhmDzz+EMb9HiaeiBynV3gTgBHAQwBDbw1gtNt3ddJezU0grqca0kmqNxIMXesf6L5cEw+W1NQ2tzU2taGpaDUk06HU9IZwyJMXiYXiG+uCfGB5QNWUngJ8COGy12I67Qc3CarFpfL/k53ul57qcndUTId9lEyGf3eyptK1qXl/dsmYjDJJRd4zq6jM2lir7sjULbbvqDVtjw+rXhNk1XshKGgODBzHqd/eomvIYgJ9ZLbaSdvxzRZezcx2A20zGirvWrdl8xupVG1AoH6VUJoTcAqCTm7COaxZaliQ57K4mVVN3i4J41mztxsY8OObuDibT8e8CeMFqsSVKFIVw60Qdn3US3AY36zhdzs41AO6rqar/xpaNW43V1fn7Wwoqg2IbIeQdnKwk3XLz3o8IEc6fqV7VVBw95oJ3rP/fANxrtdiG5iPHgLtHqKmu32IyVVxhNJjOlyTDFkEQGQFJAHsB7AbwPoD9heYhTJF1oShIz5/Z+pn21pZN+fcImiYgbQCOnlQkOewutml8DsDtM/WV5RQOHNqdDEXG77JabM+eiBxdzk72/awF8AVm5xMFaWtNdf2mpvrV5pXN66oMBmMVb+oC8Av2tHJ7Xu4YrM2Dq1asv2fTWZ+DKH6iBmiaeoAZgXfuag8WXnvZkmS/ea9DIMJPZ+qXSiWw78B7E/FU5Fqrxfb+QsvV5exkxlf2BP++QITb6utWrl3Xsgl1ddOG+Di3crMjiSMFfW+rr21+5ry2S8yCIE6Xq6ryo5df2fqnhddaliQ57K5GrlXpyswIch18fzSWCF9mtdiO6LVZSHQ5O5n6djUB+csVDS2XbVjfhoqK6in5QWME5AkAf8ePOjLocnZeWVtV/3r7uV80sc1xDi7duavdmVuwLEmy37T3bUEQrDO1/3Dv//iiiZDVarEdWgoZs2B7JwA3ioL06Mb15521etWZ018wBe0mIHZ+vJFBl7Pzovra5rc+23ZJjcifKFVVBkRRatu5q31aIcklqWSL7KcBh911HSHkCr1LM4K6e/5PjSZCv7vUBIHvnawW289UTWnv69/7XE/vHk3j5iQCci6l9AMAN+W03zMZHruu9/CHqWyZKEpnKor8RzNdY1mQpCjyU4ToH+8Ne49q48GR660WW/fSS/YJrBZbjILeOTYx5Nh34F1ZlqcsSoQQNge+zK3xGVgttrfHJoa+6h7qne5PCHl4prHLniSH3XWNJBnW69WxdejIoOspq8X2y1mG2LhU0zozJ1kttpdD0cAV+w86g4oiT9dR0KcB/ElO21c93r7HI5HJzGdRlBocdtdNeuOWPUmqqvx4prru3t0+r7vj27N038i1LDb/bFgcCYthtdg+CMcmtu0/6IxkKwlIdvtwdbZMVtIP9B75aHq9UlXl7/XGK2uSHHbXNkEQm/XqRkcHEY9Hrpmt/7GBAyuz79Pp5H0AFv5EbgZYLbbfhqKBbYePfJynCFFKO/kxfGaKjCZCNw56ppZSdq8Ou+uSwhHLliSH3SXEE9G79dYiTVPhG3f/QtHkj2Ybw+09PDjsPZp5bzSavw5gcik1WqvFtts71n/nxMToNEuEkEpVVV7ix++sTa9vzPPDZDLO6kgsHv5m4ThlS1IiGasxSEZdl6xgcFybDPt3eN0dRaaYXFgttmH/hLdw8/vEYsg7iwzP9hz57esUnzxNoihdoGnqt7Kf46nIoz6/O2N1EIj4JYfdVZE7RtmSpCpym8FgnNodFqDf3f2u192xfy7jhCOBRwqK2JF60Q5/MaGo8s1Hju7L2/wJgvg4dyGD190x5vH2PcXem82VLeOBkfq8tkspbCkQJcPX9ZrHYmFE4kHdOj1oVOv5YM/rhTVM0/ryUt0LW3uC4fH7EoloXrmqKt/PvldU+XtD3qOZKc9kNLfltitbkiTJYNMr9weGR7zujsNzHYepxSk52ZJdnLNIpRIPAFi3MNIeH7FE+IXApG8ytyGl9GZuwGVPU9I7cuyfkVm3hOtz25UtSQbJWFtYxhSGVDrxWqljWS02r9fX/4N0enqTD5Op4mJZTj2wAKLOVQb/6NjAztwySTJUxRPRP8x+pqAPsn0TIeRLue3KkiSH3aV7ViTLaZpKJd6Yz5ipdOLhEd9A3nxjMJjYkccP5itnqYjGQ99jx/h5MkjG6X1eIhUdDYUDXslgzHvCy5KkYGj8D/TKZTktT4R8e+YzptViC3m8h5/SqboHwN3zGXMeMgyN+gZHcssMBuNah92VOZfyujuURDL6a0mUyl+7o5q2Va88noiEvO4O/3zHVVT5bw/1fahXxdTy35nvuKVgaORIkY1OUeRbs+9D4cCrpMBVuSxJIoKgu6Cn0olevfK5gvk4jPoHb/eP64YtfbwU3lNtmy5+NtemhylryB3Z99FE6B1ZSeer64st1HxAQHTNN7Kc+vhEx7ZabC/4x4ff1aujlP7DItxOHmKJMEkm43mbcFGUph0gvO6OcDDoz3N0KU/tjmRihIqgaZprIYYfmxh6sFAlx5TJ5k4AX1uIa8yEWDxMFVWO5VYTQswOu2v6hxmJTuzOrS9L50hK6Uz2NfdCjG+12N7a/eGbT65qXn+3yVRRWM3CJW/lcUlijq1P5ZF+Se7LEOPuXZM5DpNsHh0F4OOBZ0WoqqyllGpxHlGYAVuDxgMj64Aph5TxiZE8y39ZkqRpqqxXLopSaKGukUhFHxkdG7x9fes5ekFfV+mUlYr93HOIRQR28filDAhI3v0RQgRZTk1b7JPp+H/k1pfldKcosu6v0Gg0F8nrsLs2z+caVottvN9z8LFR3+B8us8F5wG4hnsOsTVwOjyU6LjdapqadQ9j61LedFiWJMlK2qdXbpCMRUHM0Vjolvlex2qxPeIPeH813/6lYNDTe062uSiIpsKuqqbMeIRSliSlUgldhxJRlM4pKqQnZigNBEce0lMiThShUACjPjeOHNuHD/e9jX5PN/N4xcBQDzUY8mNl2KGgqioz+qeX5ZoUioy/zeJcC8tFQSza5AqiwPzBq3L920qB1WL7TZez86FYLHx/wxkr2VSUcbIXiMDj9rh7FtWmvkxNzdgQVVVhm2M2NWe8ZllgQDqdRFpOZso1qrE16BgAtnt2spNaTF2vioIWkKTRVDo54ya9TEkKvM1jXvPKDQZTkU1PFKSaSGRyQ01N/YHCurnCarHt6HJ2HhybGNrOlj6eJsBYoN0p/JXgr6iOdjfKX0GrxZbWu3w8HrmgsrImr0zVVG3UPzjj4li2zpFXb39Ta2xYlSdfMhWPmk2VdTt3tWvZsuuv+yCtqspfV1fXLZmh9ESQTMZfM5sr845hgqHx+OtvXFmVW7YsnCMnJkeL/BdEUapQVDkvCCsWDyXM5solMZAuBEwm83WFw4TCgVn3f2VLUigy8Uyhu7FBMorRSDDPkzUWD/dKkmHNUhlITxBfJiTHW5/DHxjeOduw5Xt8LkpvBEP+Iqdwg9GUN1Wk08kuFjmuKPIJhbksAcRUKrGj8DLMwTMaD87oW4jyfpLGA6FwoOiYvLKienvu53B08r/TqSQVRJFl7LpySYUsAaqmthuNposKe3hHj7Hjl9HZRipbkrzujrTP73mBqby5YNOFw+6azoIViU3uDoXGoyxdjKLI//QpijwrqKY9V3hOxNT3cGTyR8frW9YerIlU9LlR32BRdLiqKk9m3zPTvnv4cMYXXJIMzOT/4FLLOQd8RZIMFxY2Cwb98mR47PnjdS9rkrzujsl+d/ePCxUIQRBXOOyuG7KfY8nwveMBb+Y9pfRvcjJplQM2a5r6tJ4cQyNHuuYS8Fb2DvuKKt8z6Dmk5ZYx3zRZTj3qsLuyrrrDnuG+t5glgFmUNart5Nm5Pm1Iqqa+JghikaV9ZHQAwcj4PXORr+xJ8ro7EmP+oe8zX+lcGAymTaqmTgc4R2KTd/nGPJkFTCBCPaX0/TnmtFssMGvOL0VB/Gzh+EyjGxjq+YnVYpuTF+6yCCKLpyKPH+3fP1ZYLgri0w67K0OERrXuo4P7X8oJ3lpBqebkGSKXGtU8UWHRtMum7mMDBwKpdOIv5irTsiCJeQj5J4f/2DvSX1hFVFVhDvkVzFNVUeU/29/jnA63J0RYR5EJhyza5S8i1lBK2SHftXqX8Az3ab6A506rxTY5VxGWBUmYIupXg0M9L0ai+SkPRFG6QtXU74B7A0Viwav7ju6lWWWDgFRQUParfoZnNllM3EIp/YgQcoHeNaYytBx4jEX5lSLDsiGJISUn7+45vKebHRPkQhTE+wEwv2pm9t8z7Dv25+6h3mllg0fZsRSf+3gq6qJDtxNEO88VtJMQslJvqIkJHw73733FarF9p9RLLSuSvO6OYDwZuXZf93uJQqIopSwbyXYet/p0v+fgwwPunrwoOwLCYm//FQDzgr2jIJ94qWCKgQXAT/h418/Un/n57T/k/E9FlW+bz4WWZW6hNes6Lm6oW/nOued83pybBoYlViIg27njB8uZ8MCqpvX3b9l0vkiI7u+RrQv/BeBNfjh3jB8e6gkg8YzG5/FsyNfysMpZf+iDnl4MDh36uUbVG3kqtiKclAmgMEXU9trqhp+3t11amZtdhIKmCMjXePoY2uXsvLW2qv75LWdfIFVVFQVq5ELjB3Zu/jfKy9jU2MjV+bU8a9dxwU5p+47ug39ymAWxPTjTISBOZpIwRdTnqypq32zbfHFtAQGUhZEQkIyJiGUhEQXpxXUtW9paW86GUHxasGBgJ8ojIwNsH+RLy8lvWS2244bqnNQkYYqoNlGQXtmycWtb84q1hdXMpsf2IwNdzk7mV/DdSlP1t1tbNpubm1shLiBZ7LhkfNyLIW+fFo5NsmCwHVaLTdfrqRAnPUmYIqqSEOGFFQ0tN529oR1G4yfKGwUNEZB7+P+JULqcncxcdG+FqforzU1rK5qb1oL5HMyQcOW4iMcj7NAOY+NDciwRZhreE8y5pZQxTgmSHHYXm9LYY3GT0WB+an3LlhWrVp2Z+6RQ7knKjK+/xtQUyI7h7QIRbqmsqPlMXU2TUFfbmMm0xVyPmULCPIbYl8XkYd5CqpqJNASLfWUZkMORCRqNhw5rVH0FwK75ps45ZUjKosvZuXJqWqu5o7VlU8WKphbkKBaUa37/CIA5Raa7nJ0GrqUxD9NLCchmSTK0ioKhmjkxEoEQtjPWNDWtKHJMUeVhCtrHM0Yys9Neq8WWmkW84+KUIymLLmcncz/+K5Ox4obmxrV1KxpbUFNTn3vzgzwxUyfP/JgJN+Gp0er4q4o77itcNWfmjrDVYps1f0SpOGVJyoInrWUnuTdUVdReVFfbJJ7Bkq7XNipGk1kAzajaBwkhzF/7f3luOo9eTtXFwrIkaXXrogSFEz6tXcb/+ccX+N6HRRof4tPXp0KSHkY85XjAfBqnsWwB4P8Bgti634IURZsAAAAASUVORK5CYII=) no-repeat;
    background-size: 100% 100%;
    height: 24px;
    width: 35px;
}
.blink {
  animation: react-placeholder-pulse 1.5s infinite; }

@keyframes react-placeholder-pulse {
  0% {
    opacity: .6; }
  50% {
    opacity: 1; }
  100% {
    opacity: .6; } }
`;

const anim = keyframes`
  50% {
    padding-right: 10px;
  }
  100% {
    padding-right: 0;
  }
`;
const Closer = styled.div`
  width: 50px !important;
  height: 50px !important;
  cursor: pointer;
  position: fixed;
  color: #7367f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  top: 50% !important;
  right: ${(params: {state: boolean, isSomethingToShow: boolean}) => !params.isSomethingToShow ? '-50' : params.state ? '310' : '20'}px !important;
  transition: right 0.5s;
  z-index: 999999;
  border-radius: 100%;
  transform: translateY(-50%) !important;
  background: white !important;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.07) !important;
  animation: ${anim} 0.5s infinite;
  ${(params: {state: boolean, isSomethingToShow: boolean}) => params.state ? `animation: none;` : ''}
`;

const Helper: FunctionComponent<{ connections: ConnectionsReducerState[] }> = (
  params
) => {
    const somethingToShow = Boolean(params.connections.length);
    const [show, setShow] = useState(false);
    useEffect(() => {
        (async () => {
            const value = await LinvoDB.getToolbarValue();
            setShow(value);
        })();
    }, []);

    const changeShow = () => {
        LinvoDB.setToolBarValue(!show);
        setShow(!show);
    }

    return (
    <>
        <Closer isSomethingToShow={somethingToShow} state={show} onClick={changeShow}>
            {show ? '>>' : '<<'}
        </Closer>
        <HelperStyle show={show && somethingToShow}>
            <Frame>
                <FrameContextConsumer>
                    {(frameContext) => (
                        <StyleSheetManager target={frameContext.document.head}>
                            <div>
                                <Global/>
                                <link
                                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,300;1,400;1,500;1,600&display=swap"
                                    rel="stylesheet"
                                />
                                <div
                                    style={{
                                        background: "white",
                                        width: "100%",
                                        position: "fixed",
                                        left: 0,
                                        top: 0,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className="logo"/>
                                    <h2>Linvo</h2>
                                </div>
                                <div style={{marginBottom: 70}}/>
                                <BatchComponent batch={params.connections}/>
                            </div>
                        </StyleSheetManager>
                    )}
                </FrameContextConsumer>
            </Frame>
        </HelperStyle>
    </>
    );
};

export default connect((app: AppState) => ({ connections: app.connections }))(
  Helper
);
