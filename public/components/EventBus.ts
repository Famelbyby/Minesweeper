class EventBus {
    private incomingEvents: [string];
    private handlers: any;

    constructor(incomingEvents: [string]) {
        this.incomingEvents = incomingEvents;
        this.handlers = {};
    }

    addEventListener(event: string, handler: () => {}) {
        if (!this.incomingEvents.includes(event)) {
            throw new Error("Event is not allowed");
        }

        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }

        this.handlers[event].push(handler);
    }

    emit(event: string, data: any) {
        if (!this.incomingEvents.includes(event)) {
            throw new Error("Event is not allowed");
        }

        if (!this.handlers[event]) {
            return;
        }

        this.handlers[event].forEach((handler: any) => {
            handler(data);
        });
    }
}

export default EventBus;
