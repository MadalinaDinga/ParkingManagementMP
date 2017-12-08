package com.android.app.parkinglots.dummy;

/**
 * A dummy item representing a parking lot.
 */
public class ParkingLot {

    public final int id;
    public String name;
    public String description;

    public ParkingLot(int id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    @Override
    public String toString() {
        return "id: " + name + " " + description;
    }
}

