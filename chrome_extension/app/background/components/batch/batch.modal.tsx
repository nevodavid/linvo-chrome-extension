import React, { FunctionComponent, useState } from "react";
import { BasicModalInterface } from "../../../global.components/modal.component";
import { ConnectionsReducerState } from "../../store/reducers/connections.reducer";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { TextArea } from "../../../global.components/textarea";
import { DateChoosePicker } from "../../../global.components/date.choose.picker";
import { DateTimePickerComponent } from "../../../global.components/date.time.picker";
import moment from 'moment';
import {sendRequest} from "../../background";
import {config} from "../../../config/config";
import swal from 'sweetalert';

interface BatchModalProps {
  connections?: ConnectionsReducerState[];
  pageRangeFrom?: number;
  markAsSchedule?: () => void;
}

interface PageRangeComponentInterface {
  updatePage: (page: { start: number; end: number }) => void;
  page: {
    start: number;
    end: number;
  };
}

const PageRangeComponent: FunctionComponent<PageRangeComponentInterface> = (
  props
) => {
  const updateValues = (
    event: React.ChangeEvent<{ name: string; value: string }>
  ) => {
    props.updatePage({
      ...props.page,
      [event.target.name]: +event.target.value,
    });
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", marginRight: 20 }}>
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">From Page</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="start"
            value={props.page.start}
            onChange={updateValues}
          >
            {[...new Array(props.page.end - 1)].map((page, index) => (
              <MenuItem
                selected={index + 1 === props.page.start}
                value={index + 1}
              >
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div style={{ flex: 1, display: "flex", marginLeft: 20 }}>
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">End Page</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="end"
            value={props.page.end}
            onChange={updateValues}
          >
            {[...new Array(10)].map((page, index) => (
              <MenuItem
                selected={(index + props.page.start + 1) === props.page.end}
                value={index + props.page.start + 1}
              >
                {index + props.page.start + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export const BatchModal: FunctionComponent<
  BasicModalInterface & BatchModalProps
> = (params) => {
  const [pageRange, setPageRange] = useState({
    start: params.pageRangeFrom,
    end: params.pageRangeFrom ? params.pageRangeFrom + 1 : undefined,
  });

  const [schedule, setSchedule] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);

  const send = async () => {
    const obj = {
      date: moment(schedule ? date : undefined).utc().format('YYYY-MM-DD HH:mm:ss'),
      message,
      location: window.location.href,
      connections: params.pageRangeFrom ? [] : params.connections,
      pageRangeFrom: params.pageRangeFrom ? pageRange : null
    };

    setLoader(true);
    await sendRequest(`${config.api_url}/schedule/connect`, {
      method: 'post',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!params.pageRangeFrom) {
      params.markAsSchedule();
    }

    swal("Good job!", "We will start connecting soon!", "success");

    setLoader(false);
    params.close();

  };

  const setNewValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <DateChoosePicker checked={schedule} onChange={setSchedule} />
      </div>

      {schedule && (
        <div style={{ marginTop: 30, display: "flex", width: "50%" }}>
          <div style={{ flex: 1, marginRight: 20, display: "flex" }}>
            <DateTimePickerComponent
              title="Date"
              defaultDate={date}
              onDateChange={setDate}
              placeholder="Click to choose"
              minDate={new Date()}
            />
          </div>
        </div>
      )}

      {pageRange.end && (
        <div style={{ marginTop: 30, display: "flex", width: "100%" }}>
          <PageRangeComponent updatePage={setPageRange} page={pageRange} />
        </div>
      )}

      {!params.pageRangeFrom && (
        <div
          style={{
            paddingLeft: "0.2rem",
            marginRight: "20px",
            marginTop: "30px",
            fontSize: "0.85rem",
            color: "rgb(70, 70, 70)",
          }}
        >
          <strong>Sending to:</strong>&nbsp;
          {params.connections &&
            params.connections.map((connection, index) => (
              <span>
                {connection.name}
                {index === params.connections.length - 1 ? "." : ", "}
              </span>
            ))}
        </div>
      )}

      <div style={{ marginTop: 30, display: "flex" }}>
        <div style={{ flex: 1 }}>
          <TextArea
            maxLength={300}
            value={message}
            onChange={setNewValue}
            title="Message"
            bbcodes={[
              { label: "Name", bbcodeName: "name" },
              { label: "Last Name", bbcodeName: "lastname" },
              { label: "Company", bbcodeName: "company" },
            ]}
          />
        </div>
      </div>

      {params.button([
        {
          variant: "primary",
          isLoading: loader,
          name: schedule ? "Schedule!" : "Send!",
          onClick: send,
        },
      ])}
    </>
  );
};
