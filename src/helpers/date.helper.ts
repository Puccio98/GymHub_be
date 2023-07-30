export class DateHelper {
    static today_string(): string {
        return new Date().toISOString().slice(0, 10);
    }
}