import request from 'superagent';
import moment from 'moment';

const CALENDAR_ID = 'illinois.edu_3foqlqqpobin4tih933sh157ts@group.calendar.google.com';
const API_KEY = 'AIzaSyCLF2m36RARqj-FFfPOcbBCLHW1TCDDt8k';
const google_calendar_url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;

export const getEventsAndDetails = (events_callback, details_callback) => {
    moment.locale('en-US');
    request
        .get(google_calendar_url)
        .end((err, resp) => {
            if (!err) {
                const events = [];
                const details = [];
                let idx = 0;
                JSON.parse(resp.text).items.forEach((event) => {
                    let detail_info = {
                        title: event.summary,
                        gcal_link: event.htmlLink,
                        creator: event.creator.email,
                        start: moment().format(event.start.date || event.start.dateTime),
                        end: moment().format(event.end.date || event.end.dateTime)
                    };
                    if (event.conferenceData) {
                        for (let entry in event.conferenceData.entryPoints) {
                            switch (entry.entryPointType) {
                                case "video":
                                    detail_info['video'] = entry.uri;
                                    break;
                                case "phone":
                                    detail_info['phone'] = {
                                        label: entry.label,
                                        uri: entry.uri
                                    };
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    details.push(detail_info);
                    events.push({
                        start: event.start.date || event.start.dateTime,
                        end: event.end.date || event.end.dateTime,
                        title: event.summary,
                        index: idx++
                    });
                });
                events_callback(events);
                details_callback(details);
            }
        });
}
