export interface Slice{
    origin_name: string;
    destination_name: string;
    departure_date_time_utc: Date;
    arrival_date_time_utc: Date;
    flight_number: string;
    duration: number;
}