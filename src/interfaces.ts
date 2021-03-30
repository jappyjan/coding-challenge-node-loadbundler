export interface TimeWindow {
    start: string;
    end: string;
}

export interface Load {
    destination: string;
    pieces: number;
    splitable: boolean;
    loading_window: TimeWindow;
    unloading_window: TimeWindow;
}