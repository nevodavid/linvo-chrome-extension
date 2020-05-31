import React from 'react';
import {EventsResponse, EventsService} from "./services/events.service";
import PopupComponent from "./components/popup/popup.component";

interface AppState {
  components: React.ReactElement[];
}
class App extends React.Component<{}, AppState> {
  state: AppState = {
    components: []
  };

  eventsToBeExecuted: any[] = JSON.parse(localStorage.getItem('eventsToBeExecuted') || '[]');

  componentDidMount() {
    this.eventsToBeExecuted.map((id) => {
      this.trigger(id);
    });

    localStorage.setItem('eventsToBeExecuted', '[]');
    this.eventsToBeExecuted = [];

    this.loadEvents((event) => {
      this.eventsToBeExecuted.push(event.id);
      localStorage.setItem('eventsToBeExecuted', JSON.stringify(this.eventsToBeExecuted));
      setTimeout(() => {
        const index = this.eventsToBeExecuted.findIndex(e => e === event.id);
        if (index > -1) {
          this.eventsToBeExecuted.splice(index, 1);
          localStorage.setItem('eventsToBeExecuted', JSON.stringify(this.eventsToBeExecuted));
          this.trigger(event.id);
        }
      }, 7001);
    });
  }

  removeComponent = (index: any) => () => {
    const {components} = this.state;
    const findIndex = components.indexOf(index);
    components.splice(findIndex, 1);
    this.setState({
      components
    });
  };

  trigger = async (id: string) => {
    const {components} = this.state;

    const widget = await EventsService.getWidget(id);

    const Popup = <PopupComponent text={widget.text} />;

    components.push(React.cloneElement(Popup, {
      close: this.removeComponent(Popup)
    }));

    this.setState({
      components
    });
  }

  loadEvents = async (onFoundEvent: (event: EventsResponse) => void) => {
    const events = await EventsService.getAll();
    return events.map((currentEvent) => {
      const selectors: any[] = currentEvent.events.reduce((all, event) => {
        const select = document.querySelectorAll(event.match);
        if (!select) {
          return all;
        }

        return [
            ...all,
            Array.from(select)
        ];
      }, [] as any[]);

      const possibleKey = localStorage.getItem(`event-${currentEvent.id}`);
      let found = possibleKey ? Number(possibleKey) : -1;

      return selectors.map((currentSelect, index) => {
        currentSelect.map((eventor: any) => {
          return eventor.addEventListener('click', () => {
            if (found + 1 === index) {
              localStorage.setItem(`event-${currentEvent.id}`, String(index));
              found = index;
            }
            else {
              return ;
            }

            if (selectors.length - 1 === index) {
              found = -1;
              localStorage.removeItem(`event-${currentEvent.id}`);
              onFoundEvent(currentEvent);
            }
          });
        })
      });
    });
  }

  render() {
    const {components} = this.state;
    return (
        <>
          {components.map((component, index) => <React.Fragment key={index}>{component}</React.Fragment>)}
        </>
    );
  }
}

export default App;
