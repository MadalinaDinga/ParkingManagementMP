package com.android.app.parkinglots.dummy;

public class Request {

    private int id;

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private String type;

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    private String requestedAt;

    public String getRequestedAt() {
        return this.requestedAt;
    }

    public void setRequestedAt(String requestedAt) {
        this.requestedAt = requestedAt;
    }

    private String period;

    public String getPeriod() {
        return this.period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    private String requestedFor;

    public String getRequestedFor() {
        return this.requestedFor;
    }

    public void setRequestedFor(String requestedFor) {
        this.requestedFor = requestedFor;
    }

    private String createdBy;

    public String getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    private String requestedFrom;

    public String getRequestedFrom() {
        return this.requestedFrom;
    }

    public void setRequestedFrom(String requestedFrom) {
        this.requestedFrom = requestedFrom;
    }

    private int parkingNo;

    public int getParkingNo() {
        return this.parkingNo;
    }

    public void setParkingNo(int parkingNo) {
        this.parkingNo = parkingNo;
    }

    private String status;

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    private String reservationRequestedAt;

    public String getReservationRequestedAt() {
        return this.reservationRequestedAt;
    }

    public void setReservationRequestedAt(String reservationRequestedAt) {
        this.reservationRequestedAt = reservationRequestedAt;
    }

    private String rentalRequestedAt;

    public String getRentalRequestedAt() {
        return this.rentalRequestedAt;
    }

    public void setRentalRequestedAt(String rentalRequestedAt) {
        this.rentalRequestedAt = rentalRequestedAt;
    }

    @Override
    public String toString() {
        return type + " " + requestedFor + " " + createdBy + " " + status;
    }
}
