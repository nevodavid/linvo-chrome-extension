import styled from 'styled-components';
import React, { FunctionComponent } from 'react';
import { ConnectionsReducerState } from '../background/store/reducers/connections.reducer';

export const Post = styled.div`
  margin-bottom: ${(params: { marginBottom?: number }) =>
    params.marginBottom !== undefined ? params.marginBottom : '20px'};
  flex: 1;
  .article {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 3px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .article div.post-author {
    display: flex;
    padding: 14px 14px 0;
  }

  .article div.post-author a {
    flex: 1;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.6);
  }

  .article div.post-author > div {
    cursor: pointer;
    border-radius: 50%;
    height: 32px;
    width: 32px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .article div.post-author > div:hover {
    background: #f3f6f8;
  }

  .article div.post-author > div > span {
    padding: 2px;
    font-size: 4px;
  }

  .article div.post-author a > div {
    display: flex;
  }

  .article div.post-author a > div img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid transparent;
    margin-right: 6px;
  }

  .article div.post-author a > div > div {
    display: flex;
    flex-direction: column;
    margin-top: 1px;
  }

  .article div.post-author a > div > div > span {
    line-height: 10px;
    margin-top: 4px;
    margin-left: 1px;
  }

  .article div.post-author a > div > div div strong {
    color: #000;
    font-size: 15px;
  }

  .article div.post-author a > div > div div strong:hover {
    color: #0073b1;
  }

  .article div.post-author a > div > div div span span {
    font-size: 14px;
    font-weight: bold;
  }

  .article div.post-data p {
    padding: 8px 14px 0;
  }

  .article div.post-data p span {
    color: #0073b1;
    font-weight: bold;
    cursor: pointer;
  }

  .article div.post-data p a {
    color: #0073b1;
    font-weight: bold;
  }

  .article div.post-data p.post-translation {
    padding-left: 7px;
  }

  .article div.post-data p.post-translation button {
    border: 0;
    background: #fff;
    color: #0073b1;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
    padding: 4px 7px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .article div.post-data p.post-translation button:hover {
    background-color: #e8f7ff;
  }

  .article div.post-data img {
    width: 100%;
    cursor: pointer;
    border-bottom: 1px solid #e6e9ec;
    border-top: 1px solid #e6e9ec;
  }

  .article div.post-interactions div.interactions-amount {
    margin: 0 16px;
    border-bottom: 1px solid #e6e9ec;
    padding-bottom: 10px;

    display: flex;
    align-items: center;
  }

  .article div.post-interactions div.interactions-amount span.fas {
    font-size: 8px;
    padding: 3px;
    margin-right: 3px;
    border-radius: 50%;
    color: #f3f6f8;
    text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3), 1px -1px 0 rgba(0, 0, 0, 0.3),
      -1px 1px 0 rgba(0, 0, 0, 0.3), 1px 1px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .article div.post-interactions div.interactions-amount span.amount-info {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 3px;
    cursor: pointer;
  }

  .article div.post-interactions div.interactions-amount span.amount-info span {
    font-size: 14px;
    font-weight: bold;
  }

  .article div.post-interactions div.interactions-amount span.like-icon {
    background: #0092e0;
  }

  .article div.post-interactions div.interactions-amount span.heart-icon {
    background: #f67373;
  }

  .article div.post-interactions div.interactions-btns {
    align-items: center;
    margin: 4px 10px;
    display: flex;
  }

  .article div.post-interactions div.interactions-btns button {
    border: 0;
    background: #fff;
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
    font-size: 14px;
    padding: 2px 5px;
    height: 30px;
    margin-right: 5px;
    cursor: pointer;

    display: flex;
    align-items: center;
  }

  .article div.post-interactions div.interactions-btns button:hover {
    background: #f1f1f1;
    color: rgba(0, 0, 0, 0.8);
  }

  .article div.post-interactions div.interactions-btns button span.far {
    font-size: 20px;
    margin-right: 5px;
  }

  .article
    div.post-interactions
    div.interactions-btns
    button
    span.fa-thumbs-up {
    margin-bottom: 4px;
  }

  .article
    div.post-interactions
    div.interactions-btns
    button
    span.fa-share-square {
    font-size: 18px;
  }
`;
export const ConnectionComponent: FunctionComponent<{connection: ConnectionsReducerState}> = (props) => {
  const { connection } = props;
  return (
    <Post marginBottom={0}>
      <div className="article">
        <div className="post-author">
          <a style={{ textDecoration: 'none' }} href="javascript:void(0)">
            <div>
              <img src={connection.image || '/no-icon.png'} alt="" />
              <div>
                <div>
                  <strong className="post-author-name">
                    {connection.name.slice(0, 12)}
                  </strong>
                  <span>
                    <span>&nbsp;·&nbsp;</span>
                    1st
                  </span>
                  <div style={{ height: 36 }}>
                    {connection.description.slice(0, 20)}...
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </Post>
  );
};
