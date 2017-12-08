package com.android.app.parkinglots.dummy;

import com.google.gson.Gson;

import android.app.Activity;
import android.content.Context;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
public class Parking {

    private static final String FILENAME = "data.json";

    private Parking() {
    }

    private static Parking mParking;

    public static Parking getInstance(Activity activity) {
        if (mParking == null) {
            retrieveDataFromPersistance(activity);
            // if file is empty (at first run or after clear cache), we load the data from assets
            if (mParking == null) {
                mParking = loadDataFromAssets(activity);
            }
        }
        return mParking;
    }

    private ArrayList<String> status;

    public ArrayList<String> getStatus() {
        return this.status;
    }

    public void setStatus(ArrayList<String> status) {
        this.status = status;
    }

    private ArrayList<RequestType> requestTypes;

    public ArrayList<RequestType> getRequestTypes() {
        return this.requestTypes;
    }

    public void setRequestTypes(ArrayList<RequestType> requestTypes) {
        this.requestTypes = requestTypes;
    }

    private ArrayList<Request> requests;

    public ArrayList<Request> getRequests() {
        return this.requests;
    }

    public void setRequests(ArrayList<Request> requests) {
        this.requests = requests;
    }

    private ArrayList<User> users;

    public ArrayList<User> getUsers() {
        return this.users;
    }

    public void setUsers(ArrayList<User> users) {
        this.users = users;
    }

    private static Parking loadDataFromAssets(Activity activity) {
        String json = null;
        try {
            InputStream is = activity.getAssets().open(FILENAME);
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        Gson gson = new Gson();
        Parking parking = gson.fromJson(json, Parking.class);
        return parking;
    }

    public static void storeDataIntoPersistance(Activity act) {
        // convert the current parking object into json string
        Gson gson = new Gson();
        String parkingAsJson = gson.toJson(mParking);
        try {
            // store json into the same file
            FileOutputStream fos = act.openFileOutput(FILENAME, Context.MODE_PRIVATE);
            fos.write(parkingAsJson.getBytes());
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void retrieveDataFromPersistance(Activity act) {
        try {
            FileInputStream fin = act.openFileInput(FILENAME);
            int c;
            String json = "";
            while ((c = fin.read()) != -1) {
                json = json + Character.toString((char) c);
            }
            fin.close();
            Gson gson = new Gson();
            Parking parking = gson.fromJson(json, Parking.class);
            mParking = parking;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void addNewRequest(String creator_name, String receiver_name, String type) {
        Request request = new Request();
        request.setCreatedBy(creator_name);
        request.setRequestedFor(receiver_name);
        request.setType(type);
        request.setStatus("Pending");
        request.setId(requests.size() + 1);
        this.requests.add(request);
    }

    public Request getItemById(int id) {
        for (Request item : requests) {
            if (item.getId() == id) {
                return item;
            }
        }
        return null;
    }

    public void updateRequest(Request request) {
        for (Request item : requests) {
            if (item.getId() == request.getId()) {
                item.setType(request.getType());
                item.setRequestedFor(request.getRequestedFor());
                item.setCreatedBy(request.getCreatedBy());
            }
        }
    }

    public void removeRequest(Request request) {
        try {
            mParking.requests.remove(request);
        } catch (Exception ex) {
        }
    }

    public int[] getRequestsStats() {
        int[] x = {0, 0, 0, 0, 0, 0, 0};
        for (Request item : requests) {
            switch (item.getType()) {
                case "Parking Spot Rental":
                    x[0]++;
                    break;
                case "Parking Spot Reservation":
                    x[1]++;
                    break;
                case "Parking Subscription":
                    x[2]++;
                    break;
                case "Cancel Subscription":
                    x[3]++;
                    break;
                case "Cancel Reservation":
                    x[4]++;
                    break;
                case "Quit Rental":
                    x[5]++;
                    break;
                case "Drop out registration":
                    x[6]++;
                    break;
            }
        }
        return x;
    }
}