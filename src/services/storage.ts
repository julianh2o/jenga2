class StorageService {
    private static instance: StorageService;
    private storage?: Storage;

    private constructor() {
        this.storage = typeof window !== 'undefined' ? window.localStorage : undefined;
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    public setObject<T>(key: string, value: T): void {
        if (!this.storage) return;
        this.storage.setItem(key, JSON.stringify(value));
    }

    public getObject<T>(key: string): T | null {
        if (!this.storage) return null;
        const value = this.storage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    public clear(): void {
        if (!this.storage) return;
        this.storage.clear();
    }
}

export default StorageService.getInstance();