package com.android.app.parkinglots.dummy;

import java.util.ArrayList;
import java.util.List;
public class ParkingLotCollection {

    /**
     * An array of sample (dummy) items.
     */
    public static final List<ParkingLot> ITEMS = new ArrayList<ParkingLot>();
    /**
     * A map of sample (dummy) items, by ID.
     */
    private static final int COUNT = 25;

    static {
        // Add some sample items.
        for (int i = 1; i <= COUNT; i++) {
            addItem(createDummyItem(i));
        }
    }

    private static void addItem(ParkingLot item) {
        ITEMS.add(item);
    }

    private static ParkingLot createDummyItem(int position) {
        return new ParkingLot(position, "Parking Lot " + position, makeDescription(position));
    }

    private static String makeDescription(int position) {
        StringBuilder builder = new StringBuilder();
        builder.append("Details about Item: ").append(position);
        return builder.toString();
    }

    public static ParkingLot getItemById(int id) {
        for (ParkingLot item : ITEMS) {
            if (item.id == id) {
                return item;
            }
        }
        return null;
    }
}
