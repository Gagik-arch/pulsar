import { isEqualObjects, isPlainObject } from './utils';

class Store<T> {
    private state: T;
    private listeners: ((state: T) => void)[] = [];

    public constructor(initialState: T) {
        this.state = initialState;
    }

    public subscribe(callback: (state: T) => void): () => void {
        this.listeners.push(callback);

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    public effect(callback: (state: T) => void): () => void {
        callback(this.getState());

        return this.subscribe((prevState) => callback(prevState));
    }

    public setState(newState: T | ((prev: T) => T)) {
        const state
            = typeof newState === 'function'
                ? (newState as (prev: T) => T)(this.state)
                : newState;

        if (isPlainObject(this.state) && isPlainObject(state)) {
            if (!isEqualObjects(this.state, state)) {
                this.state = state;
                this.notify();
            }
        } else {
            if (this.state === state) return;

            this.state = state;
            this.notify();
        }
    }

    public getState() {
        return this.state;
    }

    private notify() {
        this.listeners.forEach((listener) => {
            listener(this.state);
        });
    }
}

export default Store;
