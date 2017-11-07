package com.example.dacianmujdar.parkinglots;

import com.example.dacianmujdar.parkinglots.dummy.Parking;
import com.example.dacianmujdar.parkinglots.dummy.Request;
import com.example.dacianmujdar.parkinglots.dummy.RequestType;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import java.util.ArrayList;
/**
 * An activity representing a single ParkingLot detail screen. This
 * activity is only used on narrow width devices. On tablet-size devices,
 * item details are presented side-by-side with a list of items
 * in a {@link ParkingLotListActivity}.
 */
public class ParkingLotDetailActivity extends AppCompatActivity {

    public static final String ARG_ITEM_ID = "DetailItem";
    private boolean is_edit_enabled = false;
    EditText mCreatorET;
    EditText mReceiverET;
    FloatingActionButton mFab;
    Request mRequest;
    Spinner mTypeS;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parkinglot_detail);
        // Get the item id from Intent
        Intent intent = getIntent();
        int id = intent.getIntExtra(ARG_ITEM_ID, 0);
        mRequest = Parking.getInstance(this).getItemById(id);
        // set the description
        mCreatorET = (EditText) findViewById(R.id.parkinglot_creator);
        mCreatorET.setText(mRequest.getCreatedBy());
        mReceiverET = (EditText) findViewById(R.id.parkinglot_receiver);
        mReceiverET.setText(mRequest.getRequestedFor());
        mTypeS = (Spinner) findViewById(R.id.request_types_details);
        setRequestTypeSpinner();
        // set the toolbar
        Toolbar toolbar = (Toolbar) findViewById(R.id.detail_toolbar);
        toolbar.setTitle(mRequest.toString());
        setSupportActionBar(toolbar);
        mFab = (FloatingActionButton) findViewById(R.id.fab);
        mFab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (is_edit_enabled) {
                    disableEditMode();
                } else {
                    enableEditMode();
                }
            }
        });
        // Show the Up button in the action bar.
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
    }

    private void enableEditMode() {
        is_edit_enabled = true;
        Toast.makeText(getApplicationContext(), "You can now edit!", Toast.LENGTH_SHORT).show();
        mCreatorET.setEnabled(true);
        mReceiverET.setEnabled(true);
        mTypeS.setEnabled(true);
        if (mFab != null) {
            mFab.setImageResource(android.R.drawable.ic_menu_save);
        }
    }

    private void disableEditMode() {
        is_edit_enabled = false;
        mCreatorET.setEnabled(false);
        mTypeS.setEnabled(false);
        mReceiverET.setEnabled(false);
        if (mFab != null) {
            mFab.setImageResource(android.R.drawable.ic_menu_edit);
        }
        //save the data to the instance
        mRequest.setCreatedBy(mCreatorET.getText().toString());
        mRequest.setRequestedFor(mReceiverET.getText().toString());
        mRequest.setType(mTypeS.getSelectedItem().toString());
        Parking.getInstance(this).updateRequest(mRequest);
    }

    private void setRequestTypeSpinner() {
        ArrayList<RequestType> requestTypes = Parking.getInstance(this).getRequestTypes();
        ArrayAdapter<RequestType> spinnerAdapter = new ArrayAdapter<RequestType>(this, android.R.layout.simple_spinner_dropdown_item, requestTypes);
        mTypeS.setAdapter(spinnerAdapter);
        mTypeS.setEnabled(false);
        int index = 0;
        for (RequestType r : requestTypes) {
            if (r.getType().equals(mRequest.getType())) {
                index = requestTypes.indexOf(r);
            }
        }
        mTypeS.setSelection(index);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == android.R.id.home) {
            // This ID represents the Home or Up button. In the case of this
            // activity, the Up button is shown. For
            // more details, see the Navigation pattern on Android Design:
            //
            // http://developer.android.com/design/patterns/navigation.html#up-vs-back
            //
            navigateUpTo(new Intent(this, ParkingLotListActivity.class));
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
