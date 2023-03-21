export default class ConcurrentHashSet<T> extends Array<T> {
    public constructor(init?: Partial<ConcurrentHashSet<T>>) {
        super();
        (Object as any).assign(this, init);
    }
}
