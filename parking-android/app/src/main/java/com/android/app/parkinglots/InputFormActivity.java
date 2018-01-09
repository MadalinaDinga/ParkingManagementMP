package com.android.app.parkinglots;

import com.android.app.parkinglots.dummy.Parking;
import com.android.app.parkinglots.dummy.RequestType;

import android.content.DialogInterface;
import android.os.Build;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import java.util.ArrayList;
public class InputFormActivity extends AppCompatActivity {

    EditText mEmailET;
    EditText mCreatorNameET;
    EditText mReceiverNameET;
    Spinner mTypeS;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_input_form);
        Button mSendEmail = (Button) findViewById(R.id.email_send_email_button);
        mSendEmail.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                sendEmailTask();
            }
        });
        mEmailET = (EditText) findViewById(R.id.email);
        mCreatorNameET = (EditText) findViewById(R.id.creator_name);
        mReceiverNameET = (EditText) findViewById(R.id.receiver_name);
        mTypeS = (Spinner) findViewById(R.id.request_types);
        setRequestTypeSpinner();
    }

    private void setRequestTypeSpinner() {
        ArrayList<RequestType> requestTypes = Parking.getInstance(this).getRequestTypes();
        ArrayAdapter<RequestType> spinnerAdapter = new ArrayAdapter<RequestType>(this, android.R.layout.simple_spinner_dropdown_item, requestTypes);
        mTypeS.setAdapter(spinnerAdapter);
    }

    private void sendEmailTask() {
        final String email = mEmailET.getText().toString();
        final String creator_name = mCreatorNameET.getText().toString();
        final String receiver_name = mReceiverNameET.getText().toString();
        // add request
        Parking.getInstance(this).addNewRequest(creator_name, receiver_name, mTypeS.getSelectedItem().toString());

        AlertDialog.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            builder = new AlertDialog.Builder(InputFormActivity.this, android.R.style.Theme_Material_Dialog_Alert);
        } else {
            builder = new AlertDialog.Builder(InputFormActivity.this);
        }
        builder.setTitle("Create request")
                .setMessage("Do you want to email this request?")
                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        // send email( intent)
                        Intent i = new Intent(Intent.ACTION_SEND);
                        i.setType("message/rfc822");
                        i.putExtra(Intent.EXTRA_EMAIL, new String[]{email});
                        i.putExtra(Intent.EXTRA_SUBJECT, creator_name + " invited you to park!"); // move this to constants
                        // TO DO - build the actual body of the email
                        i.putExtra(Intent.EXTRA_TEXT, "Hello, " + receiver_name + "!");
                        try {
                            startActivity(Intent.createChooser(i, "Send mail..."));
                            Toast.makeText(InputFormActivity.this, "Request sent", Toast.LENGTH_SHORT).show();
                        } catch (android.content.ActivityNotFoundException ex) {
                            //quick little message for the user
                            Toast.makeText(InputFormActivity.this, "There are no email clients installed.", Toast.LENGTH_SHORT).show();
                        }
                    }
                })
                .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        // do nothing
                        Toast.makeText(InputFormActivity.this, "Request created", Toast.LENGTH_SHORT).show();
                    }
                })
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();

    }
}