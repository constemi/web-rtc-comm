export class Emitter {
    public events = {} as Record<string, any>;
    emit(event: any, ...args: any[]) {
        if (this.events[event]) {
            this.events[event].forEach((fn: Function) => fn(...args));
        }
        return this;
    }

    on(event: any, fn: Function) {
        if (this.events[event]) this.events[event].push(fn);
        else this.events[event] = [fn];
        return this;
    }

    off(event?: any, fn?: Function) {
        if (event && typeof fn === 'function') {
            const listeners = this.events[event];
            const index = listeners.findIndex((_fn: any) => _fn === fn);
            listeners.splice(index, 1);
        } else this.events[event] = [];
        return this;
    }
}
