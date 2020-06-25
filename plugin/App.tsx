import React from 'react';
import {EventsResponse, EventsService} from "./services/events.service";
import PopupComponent from "./components/popup/popup.component";
import FacebookPixelComponent from "./components/pixel/facebook.pixel.component";
import { v1 as uuidv1 } from 'uuid';
import smartlookClient from 'smartlook-client'

interface AppState {
  components: React.ReactElement[];
}

function live(elementId: string, cb: () => void) {
  document.addEventListener('click', function (event) {
    // @ts-ignore
    if (event.target && event.target.id === elementId) {
      cb.call(event.target, event);
    }
  });
}

const userId = localStorage.getItem('userId') || (() => {
  const id = uuidv1();
  localStorage.setItem('userId', id);
  return id;
})();

if (window.location.hostname.indexOf('lublinsky.co.il') > -1) {
  smartlookClient.init('e6a5828f61e5b85ffe4f69c048dd9b0a900448e0');
  // @ts-ignore
  window.smartlook(() => {
    // @ts-ignore
    localStorage.setItem('video', btoa(window.smartlook.playUrl))
  });
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    components: []
  };

  eventsToBeExecuted: any[] = JSON.parse(localStorage.getItem('eventsToBeExecuted') || '[]');

  componentDidMount(): void {
      this.checkPageLoaded();
  }

  checkPageLoaded() {
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

    const Component = widget.type === 'popup' ? <PopupComponent id={id} title={widget.title} text={widget.text} /> : <FacebookPixelComponent name={widget.title} id={widget.text} />;

    components.push(React.cloneElement(Component, {
      close: this.removeComponent(Component)
    }));

    this.setState({
      components
    });
  }

  saveCallbacks = [] as any[];

  loadEvents = async (onFoundEvent: (event: EventsResponse) => void) => {
    const events = await EventsService.getAll();

    document.addEventListener('mousedown', (eventin) => {
      events.map((currentEvent) => {
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
              if (eventor.contains(eventin.target)) {
                console.log('found event');
                if (found + 1 === index) {
                  localStorage.setItem(`event-${currentEvent.id}`, String(index));
                  found = index;
                } else {
                  return;
                }

                if (selectors.length - 1 === index) {
                  found = -1;
                  localStorage.removeItem(`event-${currentEvent.id}`);
                  onFoundEvent(currentEvent);
                }
              }
          });
        });
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
