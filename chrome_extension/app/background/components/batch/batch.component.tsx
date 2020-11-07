import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { ConnectionsReducerState } from '../../store/reducers/connections.reducer';
import { ConnectionComponent } from '../../../global.components/connection.component';
import { ConnectionLoaderComponent } from '../../../global.components/connection.loader.component';
import { CONNECTIONS_ACTION } from '../../store/actions/connections.action';
import { showModal } from '../../../global.components/modal.component';
import { Submit } from '../../../global.components/submit.component';
import { BatchModal } from './batch.modal';

const Button = styled.div`
  width: 25px;
  height: 71px;
  margin-right: 3px;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-sizing: border-box;
  line-height: 1;
  border-radius: 0.4285rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  border: 1px solid #7367f0;
  color: ${(params: { checked: number }) =>
      params.checked
      ? '#ffffff'
      : '#7367f0'};
  &:after {
    content: ${(params: { checked: number }) => params.checked === 2 ? '"V"' : params.checked === 0 ? '"+"' : '"X"'};
  }
  background: ${(params: { checked: number }) =>
    !params.checked ? '#ffffff' : params.checked === 2 ? '#0a5a00' : '#7367f0'};
`;

interface BatchComponentProps {
  batch: ConnectionsReducerState[];
  changeCheckBox: (connection: ConnectionsReducerState) => void;
  markAllSchedule: () => void;
}
const BatchComponent: FunctionComponent<BatchComponentProps> = (props) => {
  const { batch } = props;
  const totalMoreToLoad = document.querySelectorAll(
    '.search-result__occlusion-hint'
  ).length;
  const scrollLast = async () => {
    const search = Array.from(
      document.querySelectorAll('.search-result__occlusion-hint')
    );
    const currentScroll = document.querySelector('html');
    for (const s of search) {
      const { y } = s.getBoundingClientRect();
      currentScroll.scrollBy(0, y);
      await new Promise((res) => {
        setTimeout(() => {
          res(true);
        }, 10);
      });
    }

    document.querySelector('html').scrollTop = 0;
  };

  const totalConnection = useMemo(
      () => props.batch.some((c) => c.addConnection === 1),
      [props.batch]
  );

  const changeConnection = (connection: ConnectionsReducerState) => () => {
    if (connection.addConnection === 2) {
      return;
    }
    props.changeCheckBox(connection);
  };

  const getPage = () => {
    const url = new URL(window.location.href);
    return Number(url.searchParams.get('page') || 1);
  };

  const modal = (todo: "connection" | "page_range") => () => {
    if (!totalConnection) {
      return;
    }

    showModal({
      header: 'Add connections',
      component: (modalProps) => (
        <BatchModal
          markAsSchedule={props.markAllSchedule}
          {...(todo === 'connection'
            ? {
              connections: cloneDeep(batch).filter(
                  (c) => c.addConnection === 1
                ),
            }
            : { pageRangeFrom: getPage() })}
          {...modalProps}
        />
      ),
    });
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {totalConnection && (
          <Submit
            style={{ fontSize: 14, padding: '0.9rem 0.3rem', marginRight: 3 }}
            onClick={modal('connection')}
          >
            Add Connections
          </Submit>
        )}
        {window.location.href.indexOf('search/results') > -1 && (
          <Submit
            style={{ fontSize: 14, padding: '0.9rem 0.3rem' }}
            onClick={modal('page_range')}
          >
            Add by page range
          </Submit>
        )}
      </div>
      {totalMoreToLoad > 0 && (
        <span
          onClick={scrollLast}
          style={{
            cursor: 'pointer',
            fontSize: 14,
            marginBottom: 10,
            color: '#7367f0',
            display: 'block',
          }}
        >
          There are {totalMoreToLoad} more connections to load
        </span>
      )}

      {batch.map((connection) => (
        <div key={connection.link} style={{ display: 'flex' }}>
          <div>
            <Button
              onClick={changeConnection(connection)}
              checked={connection.addConnection}
            />
          </div>
          <ConnectionComponent connection={connection} />
        </div>
      ))}
      {[...new Array(totalMoreToLoad)].map(() => (
        <ConnectionLoaderComponent />
      ))}
    </div>
  );
};

export default connect(
  () => ({}),
  (dispatch) => ({
    changeCheckBox: (connection: ConnectionsReducerState) =>
      dispatch(
        CONNECTIONS_ACTION.changeChecked({
          ...connection,
          addConnection: Number(!connection.addConnection),
        })
      ),
    markAllSchedule: () =>
      dispatch(CONNECTIONS_ACTION.markConnectionsAsSchedule()),
  })
)(BatchComponent);
