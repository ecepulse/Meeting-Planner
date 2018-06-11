import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "./logo.svg";

import { getEventsAndDetails } from './event-handler.js';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {
    constructor() {
        super();
        this.state = {
            events: [],
            details: []
            /*
        events: [
            {
                start: new Date(),
                end: new Date(moment().add(1, "hours")),
                title: "Some title"
            }
        ]
        */
        };
    }

    componentDidMount() {
        getEventsAndDetails((events) => {
            this.state = {events: events, details: this.state.details};
        },
        (details) => {
            this.state = {events: this.state.events, details: details};
        });
    }

    onEventResize = (type, { event, start, end, allDay }) => {
        const { events } = this.state;

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent
        });

        this.setState({
            events: nextEvents
        });
        /*
    this.setState(state => {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: state.events };
    });
    */
    };

    onEventDrop = ({ event, start, end, allDay }) => {
        const { events } = this.state;

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end }
                : existingEvent
        });

        this.setState({
            events: nextEvents,
        });
    };

    render() {
        return (
            <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
            </p>
            <DnDCalendar
                defaultDate={new Date()}
                defaultView="month"
                events={this.state.events}
                onEventDrop={this.onEventDrop}
                onEventResize={this.onEventResize}
                resizable
                popup
                style={{ height: "100vh" }}
            />
            </div>
        );
    }
}

export default App;
