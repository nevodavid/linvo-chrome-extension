import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { Post } from './connection.component';

export const ConnectionLoaderComponent = () => (
  <Post marginBottom={0}>
    <div className="article blink">
      <div className="post-author">
        <a style={{ textDecoration: 'none' }} href="javascript:void(0)">
          <div>
            <div style={{ float: 'left', marginTop: -5, width: 48, height: 48, marginRight: 6, background: 'rgba(0,0,0,0.2)', borderRadius: '100%' }} />
            <div>
              <div>
                <div style={{ width: 150, marginBottom: 7, height: 15, background: 'rgba(0,0,0,0.2)' }} />
                <div style={{ height: 29 }}>
                  <div style={{ width: 150, height: 12, background: 'rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </Post>
);
