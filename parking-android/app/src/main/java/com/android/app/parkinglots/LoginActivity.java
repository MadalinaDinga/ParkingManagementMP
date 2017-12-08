package com.android.app.parkinglots;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.HashMap;
import java.util.Map;
/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity {

    private static Map<String, String> users;
    private EditText mEmailET;
    private EditText mPasswordET;
    private Button mLogInButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        mEmailET = (EditText) findViewById(R.id.email_et);
        mPasswordET = (EditText) findViewById(R.id.password_et);
        mLogInButton = (Button) findViewById(R.id.log_in_button);
        mLogInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = mEmailET.getText().toString();
                String pass = mPasswordET.getText().toString();
                if (validCredentials(email, pass)) {
                    // go to main activity
                    Context context = view.getContext();
                    Intent intent = new Intent(context, ParkingLotListActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                    finish(); // call this to finish the current activity
                } else {
                    Toast.makeText(LoginActivity.this, "Invalid credentials.", Toast.LENGTH_SHORT).show();
                }
            }
        });
        initUsers();
    }

    private boolean validCredentials(String email, String pass) {
        return users.containsKey(email) && users.get(email).equals(pass);
    }

    private void initUsers() {
        // TO DO: read these from persistance
        users = new HashMap<String, String>();
        users.put("user", "pass");
        users.put("user1", "pass1");
        users.put("user2", "pass2");
        users.put("user3", "pass3");
        users.put("user4", "pass4");
    }
}

